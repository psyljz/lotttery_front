import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
// import ManualHeader from "../commponents/ManualHeader"
import Header from "../commponents/Header"
import LotteryEntrance from "../commponents/LotteryEntrance"
export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Smart Contract Lottery</title>
                <meta name="description" content="Smart Contract Lottery for everyone" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header>d</Header>
            <LotteryEntrance></LotteryEntrance>
        
        </div>
    )
}
