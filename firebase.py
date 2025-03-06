import requests
import time
import concurrent.futures
import random
import string
from collections import defaultdict

def generate_random_subdomain():
    """a-z 조합으로 랜덤 서브도메인 생성"""
    length = random.randint(5, 10)  # 랜덤 길이 (5-10 사이)
    return ''.join(random.choice(string.ascii_lowercase) for _ in range(length))

def send_request():
    try:
        # 랜덤 서브도메인 생성
        random_subdomain = generate_random_subdomain()
        url = f"https://{random_subdomain}.page.link/.well-known/apple-app-site-association"
        response = requests.get(url, timeout=5)
        return response.status_code, random_subdomain
    except requests.exceptions.RequestException:
        return "Error", None

def main():
    # Number of requests per second
    requests_per_second = 5
    # How long to run (in seconds)
    duration = 3
    # Track status codes and counts
    status_counts = defaultdict(int)
    # 테스트한 서브도메인 저장
    tested_subdomains = []
    
    print(f"a-z 조합의 랜덤 서브도메인으로 {requests_per_second}개의 요청을 {duration}초 동안 전송합니다...")
    
    for _ in range(duration):
        start_time = time.time()
        
        # Use ThreadPoolExecutor to send requests concurrently
        with concurrent.futures.ThreadPoolExecutor(max_workers=requests_per_second) as executor:
            futures = [executor.submit(send_request) for _ in range(requests_per_second)]
            
            # Collect results
            for future in concurrent.futures.as_completed(futures):
                status_code, subdomain = future.result()
                status_counts[status_code] += 1
                if subdomain:
                    tested_subdomains.append((subdomain, status_code))
        
        # Calculate time taken and sleep if needed
        elapsed = time.time() - start_time
        if elapsed < 1:
            time.sleep(1 - elapsed)
        
        print(f"배치 완료: {elapsed:.2f}초")
    
    # Group by status code categories
    grouped_counts = defaultdict(int)
    for status, count in status_counts.items():
        if isinstance(status, int):
            category = f"{status//100}xx"
            grouped_counts[category] += count
        else:
            grouped_counts[status] += count
    
    # Print results
    print("\n상태 코드별 결과:")
    # 정렬 시 키를 문자열로 변환하여 비교 가능하게 함
    for status, count in sorted(status_counts.items(), key=lambda x: str(x[0])):
        print(f"상태 {status}: {count}개 응답")
    
    print("\n상태 코드 카테고리별 결과:")
    for category, count in sorted(grouped_counts.items()):
        print(f"카테고리 {category}: {count}개 응답")
    
    print("\n테스트한 서브도메인:")
    for subdomain, status in tested_subdomains:
        print(f"{subdomain}.page.link: {status}")
    
    total_requests = sum(status_counts.values())
    print(f"\n전송된 총 요청 수: {total_requests}")

if __name__ == "__main__":
    main()