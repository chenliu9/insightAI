import { notFound, redirect } from 'next/navigation'
import { Chat } from '@/components/chat'
import { getChat } from '@/lib/actions/chat'
import { AI } from '@/app/actions'
import WeixinShareWrapper from '@/components/weixin-share-wrapper'

export const maxDuration = 60

export interface SearchPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: SearchPageProps) {
  const chat = await getChat(params.id, 'anonymous')
  const title =
    chat?.title.toString().slice(0, 50) ||
    'Moss - Unleash the Power of Data and AI'
  const description =
    '原生态的跨行业、跨领域的大数据与大模型分析引擎，实现动态、复杂、高维数据的智能分析与汇总！'
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: title,
      type: 'website',
      images: [
        {
          url: `/opengraph-image.png`, // Must be an absolute URL
          width: 512,
          height: 512,
          alt: 'Moss'
        }
      ]
    }
  }
}

export default async function SearchPage({ params }: SearchPageProps) {
  const userId = 'anonymous'
  const chat = await getChat(params.id, userId)

  if (!chat) {
    redirect('/')
  }

  if (chat?.userId !== userId) {
    notFound()
  }

  return (
    <AI
      initialAIState={{
        chatId: chat.id,
        messages: chat.messages
      }}
    >
      <WeixinShareWrapper
        url={'https://demo.txz.tech/search/' + params.id}
        title={
          chat?.title.toString().slice(0, 50) || 'Moss - er of Data and AI'
        }
        desc={
          '原生态的跨行业、跨领域的大数据与大模型分析引擎，实现动态、复杂、高维数据的智能分析与汇总！'
        }
        imgUrl={'https://demo.txz.tech/opengraph-image.png'}
      />
      <Chat id={params.id} />
    </AI>
  )
}
