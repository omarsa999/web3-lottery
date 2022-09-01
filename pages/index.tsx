import {
  useAddress,
  useContract,
  useContractData,
  useContractCall,
} from "@thirdweb-dev/react"
import type { NextPage } from "next"
import Head from "next/head"
import { useState } from "react"
import { ethers } from "ethers"
import Header from "../components/Header"
import Loading from "../components/Loading"
import Login from "../components/Login"
import { currency } from "../constants"
import CountdownTimer from "../components/CountdownTimer"
import toast from "react-hot-toast"

const Home: NextPage = () => {
  //Login -> user Address
  const address = useAddress()

  // tickets quantity UI
  const [quantity, setQuantity] = useState<number>(1)

  // contract address
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  )

  // Reading from the Smart Contract

  //Remainnig Tickets
  const { data: remainingTickets } = useContractData(
    contract,
    "RemainingTickets"
  )

  // CurrentWinningReward
  const { data: CurrentWinningReward } = useContractData(
    contract,
    "CurrentWinningReward"
  )

  // ticketPrice
  const { data: ticketPrice } = useContractData(contract, "ticketPrice")

  // ticketCommission
  const { data: ticketCommission } = useContractData(
    contract,
    "ticketCommission"
  )
  // expiration
  const { data: expiration } = useContractData(contract, "expiration")

  // Buy Handler

  const { mutateAsync: BuyTickets } = useContractCall(contract, "BuyTickets")

  const handleBuy = async () => {
    if (!ticketPrice) return

    const notification = toast.loading("Buying your tickets ...")
    try {
      const data = await BuyTickets([
        {
          value: ethers.utils.parseEther(
            (
              Number(ethers.utils.formatEther(ticketPrice)) * quantity
            ).toString()
          ),
        },
      ])

      //Success
      toast.success("Tickets Purchased successfully!", { id: notification })
    } catch (err) {
      toast.error("Somthing went wrong!", { id: notification })
    }
  }

  //Connecting the contract & Loading
  if (isLoading) return <Loading />

  // Connecting the user
  if (!address) return <Login />

  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col">
      <Head>
        <title>Create Next App</title>
      </Head>
      <Header />

      {/* the next drow Box */}
      <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5">
        <div className="stats-container">
          <h1 className="text-5xl text-white font-semibold text-center">
            The Next Drow
          </h1>

          <div className="flex justify-between p-2 space-x-2">
            <div className="stats">
              <h2 className="text-sm">Total Pool</h2>
              <p className="text-xl">
                {CurrentWinningReward &&
                  ethers.utils.formatEther(
                    CurrentWinningReward.toString()
                  )}{" "}
                {currency}
              </p>
            </div>
            <div className="stats">
              <h2 className="text-sm">Tickets Remaining</h2>
              <p className="text-xl">{remainingTickets?.toNumber()}</p>
            </div>
          </div>

          {/* CountDown Timer */}
          <div className="mt-5 mb-3">
            <CountdownTimer />
          </div>
        </div>

        <div className="stats-container space-y-2">
          <div className="stats-container">
            <div className="flex justify-between items-center text-white pb-2">
              <h2>Ticket Price</h2>
              <p>
                {ticketPrice &&
                  ethers.utils.formatEther(ticketPrice.toString())}{" "}
                {currency}
              </p>
            </div>

            <div className="flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] border p-4">
              <p>TICKETS</p>
              <input
                type="number"
                className="flex w-full bg-transparent text-right outline-none"
                min={1}
                max={10}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2 mt-5">
              <div className="flex items-center justify-between text-emerald-300 text-sm italic font-extrabold">
                <p>Total Cost Of Tickets</p>
                <p>
                  {ticketPrice &&
                    Number(ethers.utils.formatEther(ticketPrice.toString())) *
                      quantity}{" "}
                  {currency}
                </p>
              </div>

              <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                <p>Service Fees</p>
                <p>
                  {ticketCommission &&
                    ethers.utils.formatEther(ticketCommission.toString())}{" "}
                  {currency}
                </p>
              </div>
              <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                <p>+ Network Fees</p>
                <p>TBC</p>
              </div>
            </div>

            <button
              disabled={
                expiration?.toString() < Date.now().toString() ||
                remainingTickets?.toNumber() === 0
              }
              onClick={handleBuy}
              className="mt-5 w-full bg-gradient-to-br from-red-500 to-emerald-400 px-10 py-5 rounded-md text-white shadow-xl disabled:text-gray-100 disabled:from-gray-600 disabled:to-gray-100 disabled:cursor-not-allowed"
            >
              Buy Tickets
            </button>
          </div>
        </div>
      </div>

      {/* the price per ticket Box */}
      <div>
        <div></div>
      </div>
    </div>
  )
}

export default Home
