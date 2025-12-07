import Image from 'next/image'

export default function ContactPage() {
  return (
    <section
      style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1.2fr',
      gap: '30px',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: '30px',
      maxWidth: '700px', 
      margin: '70px auto',
  }}
>
      <Image
        src="/seoyeon.jpeg"
        alt="Profile"
        width={300}
        height={300} 
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          borderRadius: '0.5rem',
          border: '1px solid rgba(0,0,0,0.1)',
        }}
/>


      <div>
        <h1 className="text-2xl font-bold mb-5">천서연</h1>
        <ul style={{ margin: 5, paddingLeft: '8px', lineHeight: '1.6' }}>
          <li>중부대학교 정보보호학과</li>
          <li>생년월일 : 2004.08.28.</li>
          <li>
            GitHub:{' '}
            <a
              href="https://github.com/westkiteS2"
              target="_blank"
              className="hover: underline hover:text-gray-500"
            >
              github.com/westkiteS2
            </a>
          </li>
          <li>
            Instagram:{' '}
            <a href="https://www.instagram.com/sy.hievm/"
            target="_blank"
            className="hover: underline hover:text-gray-500"
            >
              @sy.hievm
            </a>
          </li>
          <li>Phone: 010.8513.3642</li>
        </ul>
      </div>
    </section>
  )
}