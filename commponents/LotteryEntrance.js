import { format } from "prettier"
import { useWeb3Contract } from "react-moralis"

import { abi, contractAddresses } from "../constants"

import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"

import { ethers } from "ethers"

import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    console.log(chainId)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {},
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getPlayersNumber } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })
    async function updateUI() {
        const entranceFeeFromContract = (await getEntranceFee()).toString()
        
        const numPlayersFromCall = (await getPlayersNumber()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromContract)
        setNumberOfPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {

            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess =async function(tx){
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification =function(){
        dispatch({
            type:"info",
            message:"Transaction Complete",
            position:"topR",
            icon:"bell",


        })
    }
    return (
        <div className="p-5">
            
            {raffleAddress ? (
                <div>
                    <button className="bg-gray-200  hover:bg-red-500 text-black font-bold py-2 rounded ml-auto"
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                    >
                    {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "点击购买"
                        )}
                    </button>
            
                    <div>价格: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                    <div>本轮参与人数: {numberOfPlayers}</div>
                    <div>上一轮获奖地址: {recentWinner}</div>
                </div>
            ) : (
                <div>No Raffle Address Dete</div>
            )}
        </div>
    )
}
