import Link from 'next/link'
import { GitHubContent } from '@/types/github' // 경로가 정확한지 확인하세요
// Next.js에서 404 처리를 위한 함수 임포트
import { notFound } from 'next/navigation' 

interface RepoProps {
    name: string
}

export default async function RepoDirs({ name }: RepoProps) {
    const username = 'myyonop'
    
    // 로딩 지연 코드는 제거했습니다. (실제 배포 환경에서 불필요)
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    
    const response = await fetch(
        `https://api.github.com/repos/${username}/${name}/contents`,
        {
            headers: {
                // 토큰 변수 이름이 정확하고 값이 설정되어 있는지 확인하세요.
                Authorization : `token ${process.env.GITHUB_ACCESS_TOKEN}`,
            },
            // API 호출이 실패해도 재시도하지 않도록 cache 설정을 추가하는 것이 좋습니다.
            // cache: 'no-store',
        }
    )

    // 1. 🛑 HTTP 응답 상태 확인 (401 Unauthorized 및 기타 실패 처리)
    if (!response.ok) {
        // 응답 본문을 읽어 오류 메시지를 확인합니다.
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            // JSON 파싱 실패 시, 상태 코드만 사용
            errorData = { message: response.statusText };
        }
        
        // 401 Unauthorized 또는 404 Not Found 처리
        if (response.status === 401) {
            console.error('Authentication Error: 401 Unauthorized. Check GITHUB_ACCESS_TOKEN.');
            return <div className='mt-2 text-red-500'>❌ 인증 오류: GITHUB_ACCESS_TOKEN을 확인하세요.</div>
        }
        if (response.status === 404) {
            console.error(`Repository not found: ${username}/${name}`);
            return notFound(); 
        }

        // 그 외 모든 API 오류 처리 (Rate Limit 등)
        console.error(`GitHub API Error (${response.status}):`, errorData.message);
        return <div className='mt-2 text-red-500'>API 오류 발생: {errorData.message || '내용을 불러올 수 없습니다.'}</div>
    }

    // 2. 🛡️ JSON 파싱 및 타입 안정성 강화
    let contents: unknown;
    try {
        // response.json() 실행
        contents = await response.json(); 
    } catch (error) {
        console.error('JSON Parsing Error:', error);
        return <div className='mt-2 text-red-500'>API 응답 데이터 형식이 올바르지 않습니다.</div>
    }
    
    // 3. ⭐ 핵심 수정: contents가 배열인지 확인 (TypeError 방지) ⭐
    if (!Array.isArray(contents)) {
        console.warn('Expected array but received non-array data:', contents);
        // 빈 목록을 반환하여 렌더링 오류를 방지
        return <div className='mt-2'>이 저장소는 비어 있거나 예상치 못한 데이터입니다.</div>
    }
    
    // 4. 안전하게 필터링
    const validContents = contents as GitHubContent[];
    const dirs = validContents.filter((content) => content.type === 'dir')

    // 5. 렌더링
    return (
        <div className='mt-2'>
            <h3 className='text-xl font-bold'>Directories ({dirs.length})</h3>
            <ul>
                {dirs.map((dir) => (
                    <li key={dir.path}>
                        <Link 
                            className='underline hover:text-blue-500' 
                            href={`https://github.com/${username}/${name}/tree/master/${dir.path}`}
                            target="_blank"
                        >
                            {dir.path}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
