"use client";

/**
 * 현재 사용자의 언어 설정을 가져오는 함수
 * 브라우저의 언어 설정을 기반으로 언어 코드를 반환합니다.
 * @returns {string} 언어 코드 (예: 'ko', 'en', 'ja' 등)
 */
export function getCurrentLanguage(): string {
  const supportedLanguages = ['ko', 'en', 'ja'];
  
  if (typeof window !== 'undefined') {
    // navigator.language가 없을 경우 기본값으로 'en' 사용
    const browserLang = navigator.language || 'en';
    // 언어 코드만 추출 (예: 'ko-KR'에서 'ko'만 추출)
    const langCode = browserLang.split('-')[0];
    
    // 지원하는 언어 목록에 있는지 확인
    if (supportedLanguages.includes(langCode)) {
      return langCode;
    }
  }
  
  // 서버 사이드 또는 지원하지 않는 언어의 경우 기본 언어('en') 반환
  return 'en';
}

/**
 * 로컬 스토리지에서 사용자가 설정한 언어 설정을 가져오는 함수
 * @param {string} defaultLang 기본 언어 코드
 * @returns {string} 저장된 언어 코드 또는 기본 언어 코드
 */
export function getSavedLanguage(defaultLang: string = 'ko'): string {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('userLanguage');
    return savedLang || defaultLang;
  }
  return defaultLang;
}

/**
 * 사용자 언어 설정을 로컬 스토리지에 저장하는 함수
 * @param {string} langCode 저장할 언어 코드
 */
export function saveLanguagePreference(langCode: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userLanguage', langCode);
  }
}


// export async function getTaskResultList(): Promise<Task[]> {
//   const supabase = createClient();
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) {
//     return [];
//   }

//   const { data: tasks, error } = await supabase
//     .from('tasks')
//     .select('*')
//     .eq('user_id', user.id)
//     .order('created_at', { ascending: false });
  
//   if (error) {
//     console.error('Error fetching tasks:', error);
//     return [];
//   }

//   return tasks;
// }

// export async function uploadImage(image: File) {
//   const form = new FormData();
//   form.append("image", image);
//   form.append("root_path", "redesign/input");
//   form.append("is_compress", "true");

//   const response = await fetch("https://shineai-micro-api-server-y2ph5olwmq-du.a.run.app/upload/image", {
//     method: "POST",
//     body: form,
//   });

//   return response.json(); // 응답을 JSON으로 파싱하여 반환
// }