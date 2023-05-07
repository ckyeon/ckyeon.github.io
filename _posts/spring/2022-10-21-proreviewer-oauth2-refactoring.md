---
title: "Proreviewer OAuth2 리팩터링 과정"
date: 2022-10-21 20:32:00 +0900
categories: [Spring, Refactoring]
tags: [spring, refactoring]
---

## 2022-10-21 -- 리팩터링 과정

[Proreviewer Backend](https://github.com/cbnu-sequence/proreviewer-backend/tree/master/src/main/java/com/sequence/proreviewer/auth){:target="_blank"}의 인증 부분을 개발하던 중 프론트엔드의 요구사항으로 인해 `SpringSecurity`를 이용하지 않고 OAuth2 로그인을 구현해야하는 일이 생겼다.

때문에, 먼저 OAuth2.0에 대해 간단한 [정보 조사](https://ckyeon.notion.site/OAuth2-0-49f94f32f4c64913b0dfc5d5a9987972){:target="_blank"} 후 OAuth2 Login을 구현하게 되었다.

일단 이론과 github, google의 API 문서만 보고 구현해야 했기에  
작동하지만 악취가 풀풀 나는 코드를 작성했다.

```java
@Service
@RequiredArgsConstructor
public class AuthService {

	private final AuthRepository authRepository;
	private final UserRepository userRepository;
	private final JwtProvider jwtProvider;
	private final Environment env;

	public AuthTokens githubLogin(LoginRequestDto dto) {
		String accessToken = this.getGithubAccessToken(
			env.getProperty("github.access-token.url"),
			dto.getCode()
		);

		UserInfo userInfo = this.getGithubUserInfo(
			env.getProperty("github.user-api.url"),
			accessToken
		);

		Long loginUserId = login(userInfo);
		return AuthTokens.builder()
			.accessToken(jwtProvider.accessToken(String.valueOf(loginUserId)))
			.refreshToken(UUID.randomUUID().toString())
			.build();
	}

	private String getGithubAccessToken(String url, String code) {
		String clientId = env.getProperty("github.client-id");
		String clientSecret = env.getProperty("github.client-secret");

		HttpHeaders headers = new HttpHeaders();
		headers.set(HttpHeaders.ACCEPT, "application/json");
		HttpEntity<HttpHeaders> entity = new HttpEntity<>(headers);

		String urlTemplate = UriComponentsBuilder.fromHttpUrl(url)
			.queryParam("client_id", "{clientId}")
			.queryParam("client_secret", "{clientSecret}")
			.queryParam("code", "{code}")
			.encode()
			.toUriString();

		Map<String, String> params = new HashMap<>();
		params.put("clientId", clientId);
		params.put("clientSecret", clientSecret);
		params.put("code", code);

		ResponseEntity<String> res = new RestTemplate().exchange(
			urlTemplate,
			HttpMethod.POST,
			entity,
			String.class,
			params
		);
		HashMap<String, String> resMap = new Gson().fromJson(res.getBody(), HashMap.class);

		String err = resMap.get("error");
		if (err != null) {
			throw new InvalidAuthorizationCodeException();
		}

		return resMap.get("access_token");
	}

	private UserInfo getGithubUserInfo(String url, String accessToken) {
		HttpHeaders headers = new HttpHeaders();
		headers.set(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);
		HttpEntity<HttpHeaders> entity = new HttpEntity<>(headers);

		ResponseEntity<String> res;
		try {
			res = new RestTemplate().exchange(
				url,
				HttpMethod.GET,
				entity,
				String.class
			);
		} catch (RestClientException e) {
			throw new InvalidGithubAccessTokenException();
		}

		return new Gson().fromJson(res.getBody(), UserInfo.class);
	}

	// ...google 관련 로직 생략
}
```

악취 나는 코드를 작성하며 슬슬 익숙해졌기도 하고  
`AuthService`가 너무 비대해졌으므로 OAuth2 관련 로직을 리팩터링함과 동시에 Service에서 분리했다.

```java
@Service
@RequiredArgsConstructor
public class AuthService {

	private final AuthRepository authRepository;
	private final UserRepository userRepository;
	private final JwtProvider jwtProvider;
	private final OAuth2 oAuth2;

	public AuthTokens login(Provider provider, LoginRequestDto dto) {
		UserInfo userInfo = oAuth2.getUserInfo(provider, dto.getCode());

		User user = getUser(userInfo);
		if (!isAuthExist(userInfo)) {
			createAuth(user, userInfo, provider);
		}

		return AuthTokens
			.builder()
			.accessToken(createAccessToken(user.getId()))
			.refreshToken(createRefreshToken())
			.build();
	}

	// ...생략
}
```

```java
@RequiredArgsConstructor
@Component
class OAuth2 {

	private final Environment env;
	private Provider provider;

	UserInfo getUserInfo(Provider provider, String code) {
		settingProvider(provider);
		String accessToken = getAccessToken(code);
		ResponseEntity<String> response = requestUserInfo(accessToken);
		return getUserInfoFromResponseBody(response.getBody());
	}

        // ...중략

	private void settingProvider(Provider provider) {
		this.provider = provider;
	}

	private String getRequestUserInfoUrl() {
		if (provider == Provider.GITHUB) {
			return env.getProperty("github.user-api.url");
		}
		return env.getProperty("google.user-api.url");
	}
}
```

이제 `AuthService`가 Provider로부터 유저 정보를 가져오는 책임을 덜어내게 되었으므로, 어느 정도 SRP를 만족하게 되었다. 👍

하지만, 여기서 두 가지 큰 실수를 범하고 만다.
1. 중복 제거와 분리, 리팩터링에만 신경쓰다보니 `OAuth2` 클래스를 가변 객체로 만들어 thread safe 하지 않도록 만들었다. 
2. github와 google에서 유저 정보를 가져오는 로직의 가짜 중복과 진짜 중복을 구분하지 못하였다.


때문에, 템플릿 메소드 패턴을 적용해 로직의 가짜 중복과 진짜 중복을 구분하도록 추상화했다.

또한, `Abstract OAuth2` 클래스를 구현한 Concrete Class 들을 스프링 빈으로 등록한 다음  
`Provider`에 따라 `ApplicationContext`에서 빈을 꺼내오도록 만들었다.

```java
@Service
@RequiredArgsConstructor
public class AuthService {

	private final AuthRepository authRepository;
	private final UserRepository userRepository;
	private final JwtProvider jwtProvider;
	private final ApplicationContext context;

	public AuthTokens login(Provider provider, LoginRequestDto dto) {
		OAuth2 oAuth2 = getOAuth2ConcreteClassBean(provider);

		UserInfo userInfo = oAuth2.getUserInfo(dto.getCode());

		User user = getUser(userInfo);
		if (!isAuthExist(userInfo)) {
			createAuth(user, userInfo, provider);
		}

		return AuthTokens.builder()
			.accessToken(createAccessToken(user.getId()))
			.refreshToken(createRefreshToken())
			.build();
	}

        // ...중략

	private OAuth2 getOAuth2ConcreteClassBean(Provider provider) {
		if (provider == Provider.GITHUB) {
			return context.getBean(GithubOAuth2.class);
		}
		return context.getBean(GoogleOAuth2.class);
	}
}
```

```java
public abstract class OAuth2 {

	public UserInfo getUserInfo(String code) {
		String accessToken = getAccessToken(code);
		ResponseEntity<String> response = requestUserInfo(
			accessToken,
			createHttpHeaders(HttpHeaders.AUTHORIZATION, getBearerAccessToken(accessToken)),
			getUserInfoRequestUrl()
		);
		return getUserInfoFromResponseBody(response.getBody());
	}

	private String getAccessToken(String code) {
		ResponseEntity<String> response = requestAccessToken(
			code,
			createHttpHeaders(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE),
			createRequestAccessTokenUrlTemplate(getAccessTokenRequestUrl()),
			createRequestAccessTokenParams(code)
		);
		return getAccessTokenFromResponseBody(response.getBody());
	}

	private String getAccessTokenFromResponseBody(String responseBody) {
		return new Gson()
			.fromJson(responseBody, HashMap.class)
			.get("access_token")
			.toString();
	}

	private UserInfo getUserInfoFromResponseBody(String responseBody) {
		return new Gson().fromJson(responseBody, UserInfo.class);
	}

	private String getBearerAccessToken(String accessToken) {
		return "Bearer " + accessToken;
	}

	private HttpEntity<HttpHeaders> createHttpHeaders(String name, String value) {
		HttpHeaders headers = new HttpHeaders();
		headers.set(name, value);
		return new HttpEntity<>(headers);
	}

	abstract ResponseEntity<String> requestAccessToken(
		String code,
		HttpEntity<HttpHeaders> headers,
		String urlTemplate,
		HashMap<String, String> params
	);

	abstract ResponseEntity<String> requestUserInfo(
		String accessToken,
		HttpEntity<HttpHeaders> headers,
		String url
	);

	abstract String createRequestAccessTokenUrlTemplate(String requestUrl);

	abstract HashMap<String, String> createRequestAccessTokenParams(String code);

	abstract String getAccessTokenRequestUrl();

	abstract String getUserInfoRequestUrl();

	abstract String getClientId();

	abstract String getClientSecret();
}
```

드디어 우리의 코드가 thread safe하게 되었다. 👍  
또한, `AuthService`가 추상 클래스에 의존하고 있으므로 DIP를 만족하게 되었다. 👍👍

물론 아직 새로운 Provider가 추가 되었을 때 `AuthService`를 수정해야 하므로 OCP를 만족하지 못하고  
메소드의 파라미터가 너무 많은 문제 등이 있지만.

이는 나중에 방법이 떠올랐을 때 리팩터링 하는 것으로 한다.

---

## 2022-10-25 -- AuthService가 OCP를 만족하도록 리팩터링

현재 `AuthService` 클래스와 `Provider` 열거체(Enum)를 보았을 때 두 가지 사실을 알 수 있다.
1. `OAuth2`의 ConcreteClass와 `Provider`의 상숫값은 한 세트이다.  
2. `AuthService`의 `login()` 메서드로 넘어오는 파라미터는 `Provider` 타입이다.

이 둘을 종합해 봤을 때
1. `Provider`에 `Class<? extends OAuth2>` 타입의 상숫값 추가
2. 1번에서 추가한 상숫값을 리턴하는 메소드(getter) 추가
3. `AuthService`에서 ConcreteClass Bean을 가져올 때 2번에서 추가한 메소드 사용

위의 세 단계를 수행하면 `AuthService`가 OCP를 만족하도록 할 수 있을 것 같았다.

```java
@Getter
public enum Provider {
    GOOGLE(GoogleOAuth2.class),
    GITHUB(GithubOAuth2.class);

    private final Class<? extends OAuth2> oAuth2ConcreteClass;

    Provider(Class<? extends OAuth2> oAuth2ConcreteClass) {
        this.oAuth2ConcreteClass = oAuth2ConcreteClass;
    }
}
```
`Provider`에 `oAuth2ConcreteClass` 상숫값을 추가하고, lombok을 이용해 `getter`를 추가했다.

```java
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository authRepository;
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final ApplicationContext context;

    public AuthTokens login(Provider provider, LoginRequestDto dto) {
        // ...생략
    }

    // ...중략

    private OAuth2 getOAuth2ConcreteClassBean(Provider provider) {
        return context.getBean(provider.getOAuth2ConcreteClass());
    }
}
```

`AuthService`의 `getOAuth2ConcreteClassBean()` 메서드가 위에서 추가한 `getter`를 사용하도록 변경했다.


이제 새로운 Provider가 추가되었을 때 `AuthService`를 변경하지 않아도 된다.  
즉, OCP를 만족하게 되었다. 👍