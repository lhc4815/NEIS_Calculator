import Head from 'next/head'
import NEISCalculator from '../components/NEISCalculator'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Head>
        <title>NEIS 글자수 계산기</title>
        <meta name="description" content="나이스 세특 글자수 계산기" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4">
        <NEISCalculator />
      </main>

      <footer className="text-center mt-8 text-gray-500">
        <p>© 2025 NEIS 글자수 계산기</p>
      </footer>
    </div>
  )
}