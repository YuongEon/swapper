import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ButtonPrimaryLight } from '../Button'
import { FaArrowRightArrowLeft } from 'react-icons/fa6'
import { ICoin, ICoinState } from '../../types/coin'
import CurrentCoinField from './CurrentCoinField'
import SwapCoinField from './SwapCoinField'
import { useSearchParams } from 'react-router-dom'
import { cn } from '../../utils/cn'
import LoadingSpin from '../LoadingSpin'

const SwapForm: React.FC = () => {
	const [currentQueryParameters, setSearchParams] = useSearchParams()

	const sell = currentQueryParameters?.get('sell') ?? 'ETH'
	const buy = currentQueryParameters?.get('buy') ?? 'USD'

	const [data, setData] = useState<ICoin[]>([])
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)

	const [currentCoin, setCurrentCoin] = useState<ICoinState>({
		name: sell,
		amount: '0',
	})
	const [swapCoin, setSwapCoin] = useState<ICoinState>({
		name: buy,
		amount: '0',
	})

	const fetchData = useCallback(async () => {
		try {
			const res = await fetch('http://localhost:3001/coins')
			const data = await res.json()
			setData(data)
		} catch (error) {
			console.error('Fetch data error:', error)
		}
	}, [])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const cost = useMemo(() => {
		const inputCoin = data.find((coin) => coin.currency === sell)
		const outputCoin = data.find((coin) => coin.currency === buy)

		if (!inputCoin || !outputCoin) return '0'

		return ((1 * +inputCoin.price) / +outputCoin.price).toString()
	}, [sell, data, buy])

	const handleSwap = () => {
		setCurrentCoin(swapCoin)
		setSwapCoin(currentCoin)
		setSearchParams({ sell: swapCoin.name, buy: currentCoin.name })
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsSubmitting(true)
		setTimeout(() => {
			setIsSubmitting(false)
			setIsSuccess(true)
			setTimeout(() => setIsSuccess(false), 5000)

			setCurrentCoin({
				amount: '0',
				name: sell,
			})
			setSwapCoin({
				amount: '0',
				name: buy,
			})
		}, 3000)
	}

	const renderLoading = () => (
		<div className="flex justify-center">
			<LoadingSpin />
		</div>
	)

	const renderSuccess = () => (
		<div className="flex justify-center">
			<div role="status" className="flex flex-col items-center gap-2">
				<span className="text-[30px] font-semibold text-green-400">
					Success
				</span>
				<span className="text-white text-[18px] font-normal pb-4">
					Congratulations on your successful transaction!
				</span>
				<LoadingSpin />
			</div>
		</div>
	)

	if (isSubmitting) return renderLoading()
	if (isSuccess) return renderSuccess()

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex flex-row justify-between items-center">
				<CurrentCoinField
					data={data}
					currentCoin={currentCoin}
					setCurrentCoin={setCurrentCoin}
					swapCoin={swapCoin}
					setSwapCoin={setSwapCoin}
				/>

				<i
					className="mt-6 text-white hover:cursor-pointer p-1"
					onClick={handleSwap}
				>
					<FaArrowRightArrowLeft />
				</i>

				<SwapCoinField
					data={data}
					currentCoin={currentCoin}
					setCurrentCoin={setCurrentCoin}
					swapCoin={swapCoin}
					setSwapCoin={setSwapCoin}
				/>
			</div>

			<div className="flex flex-row justify-between items-center mt-6">
				<span className="text-[16px] font-medium text-white">
					<span className="text-[20px]">1</span> {currentCoin.name} ={' '}
					<span className="text-main-light">
						<span className="text-[20px]">{cost}</span>
					</span>{' '}
					{swapCoin.name}
				</span>

				<ButtonPrimaryLight
					className={cn(
						'px-6 py-2 rounded-full',
						+currentCoin.amount === 0 || +swapCoin.amount === 0
							? 'opacity-50 cursor-default'
							: ''
					)}
					disabled={+currentCoin.amount === 0 || +swapCoin.amount === 0}
				>
					Confirm swap
				</ButtonPrimaryLight>
			</div>
		</form>
	)
}

export default SwapForm
