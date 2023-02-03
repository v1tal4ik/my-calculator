/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import './style.scss';
import CommonInput from '../common-input/CommonInput';

export const formatToUsNumber = (value: number): string => {
	if (typeof value !== 'number') {
		return '';
	}
	return value.toString().replace(/^[+-]?\d+/, function (int) {
		return int.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
	});
};

const schema = yup.object({
	deposit: yup.number().positive().required(),
	salary: yup.number().positive().required(),
	monthlyBudget: yup.number().positive().required(),
	currentRate: yup.number().min(0.1).required(),
	officialRate: yup.number().positive().required(),
});

const App = () => {
	const {
		setValue,
		watch,
		register,
		handleSubmit,
		formState: { isDirty, isValid },
		reset,
	} = useForm({
		mode: 'all',
		resolver: yupResolver(schema),
	});

	const OFFICIAL_BUY_RATE = 37.5;
	const OFFICIAL_SELL_RATE = 36.56;

	const [profit, setProfit] = useState<number>();
	const [afterDeposit, setafterDeposit] = useState<number>();

	const depositValue = watch('deposit', false);
	const salaryValue = watch('salary', false);
	const monthlyBudgetValue = watch('monthlyBudget', false);

	const officialRateValue = watch('officialRate');
	const currentRateValue = watch('currentRate', false);

	useEffect(() => {
		setValue('officialRate', OFFICIAL_BUY_RATE);
	}, []);

	const onSubmit = (data: any) => {
		const profit = (depositValue * (currentRateValue - officialRateValue)).toFixed();
		const afterDeposit = (+profit + salaryValue * 36.6 - monthlyBudgetValue).toFixed();

		setProfit(+profit);
		setafterDeposit(+afterDeposit);
	};

	return (
		<div className='container'>
			<h2>My project</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='form-controlls'>
					<div>
						<CommonInput label='Deposit' name='deposit' register={register} currencyName='dollar' />
						<CommonInput label='Salary' name='salary' register={register} currencyName='dollar' />
						<CommonInput
							label='Monthly budget'
							name='monthlyBudget'
							register={register}
							currencyName='gryvna'
						/>
					</div>

					<div>
						<CommonInput
							label='Official dollar rate'
							name='officialRate'
							register={register}
							currencyName='gryvna'
						/>
						<CommonInput
							label='Current dollar rate'
							name='currentRate'
							register={register}
							currencyName='gryvna'
						/>
					</div>
				</div>

				<div className='btn-wrapper'>
					<button
						className='btn primary'
						onClick={() => {
							reset();
							setProfit(undefined);
							setValue('officialRate', 37.5);
						}}>
						Clear
					</button>
					<button className='btn secondary' disabled={!isDirty || !isValid}>
						Calculate
					</button>
				</div>
			</form>

			{profit && afterDeposit && (
				<div className='response'>
					<p>
						Знімаю депозит{' '}
						<span className='deposit-color'>
							{formatToUsNumber(+depositValue)}$ (
							{formatToUsNumber(+(depositValue * OFFICIAL_SELL_RATE).toFixed())}₴)
						</span>{' '}
						продаю по <span className='current-rate-color'>{currentRateValue}₴</span> ={' '}
						<span className='deposit-color'>
							{formatToUsNumber(+depositValue)}$ (
							{formatToUsNumber(+(depositValue * OFFICIAL_SELL_RATE).toFixed())}₴)
						</span>{' '}
						+ виручка{' '}
						<span className='profit-color'>
							{formatToUsNumber(+profit)}₴ (
							{formatToUsNumber(+(profit / OFFICIAL_BUY_RATE).toFixed())}$)
						</span>
						;
					</p>
					<p>
						Отримую зп{' '}
						<span className='salary-color'>
							{formatToUsNumber(+salaryValue)}$ (
							{formatToUsNumber(+(salaryValue * OFFICIAL_SELL_RATE).toFixed())}₴)
						</span>{' '}
						+ виручка{' '}
						<span className='profit-color'>
							{formatToUsNumber(+profit)}₴ (
							{formatToUsNumber(+(profit / OFFICIAL_BUY_RATE).toFixed())}$)
						</span>{' '}
						- місячні витрати{' '}
						<span className='monthly-budget-color'>
							{formatToUsNumber(+monthlyBudgetValue)}₴ (
							{formatToUsNumber(+(monthlyBudgetValue / OFFICIAL_BUY_RATE).toFixed())}$){' '}
						</span>{' '}
						={' '}
						<span className='after-deposit-color'>
							{formatToUsNumber(afterDeposit)}₴ (
							{formatToUsNumber(+(afterDeposit / officialRateValue).toFixed())}$){' '}
						</span>
					</p>
				</div>
			)}
		</div>
	);
};

export default App;
