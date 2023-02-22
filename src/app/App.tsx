/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import CommonInput from '../common-input/CommonInput';

import './style.scss';

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
			<h2>Calculate you profit!</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='form-controlls'>
					<div>
						<CommonInput
							label='Deposit'
							name='deposit'
							register={register}
							currencyName='dollar'
							step={1}
						/>
						<CommonInput
							label='Salary'
							name='salary'
							register={register}
							currencyName='dollar'
							step={1}
						/>
						<CommonInput
							label='Monthly budget'
							name='monthlyBudget'
							register={register}
							currencyName='gryvna'
							step={1}
						/>
					</div>

					<div>
						<CommonInput
							label='Official dollar rate'
							name='officialRate'
							type='number'
							register={register}
							currencyName='gryvna'
							step={'0.1'}
						/>
						<CommonInput
							label='Current dollar rate'
							name='currentRate'
							type='number'
							register={register}
							currencyName='gryvna'
							step={'0.1'}
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
				<>
					<div className='response'>
						<ul>
							<li>
								Знімаю депозит{' '}
								<span className='deposit-color'>
									{formatToUsNumber(+depositValue)}$ (
									{formatToUsNumber(+(depositValue * OFFICIAL_SELL_RATE).toFixed())}₴)
								</span>
								;
							</li>
							<li>
								Продаю по{' '}
								<span className='current-rate-color'>
									{currentRateValue}₴ (
									{formatToUsNumber(+(depositValue * currentRateValue).toFixed())}$)
								</span>
								;
							</li>
							<li>
								Виручка{' '}
								<span className='profit-color'>
									{formatToUsNumber(+profit)}₴ (
									{formatToUsNumber(+(profit / OFFICIAL_BUY_RATE).toFixed())}$)
								</span>
								;
							</li>

							<li>
								Отримую зп{' '}
								<span className='salary-color'>
									{formatToUsNumber(+salaryValue)}$ (
									{formatToUsNumber(+(salaryValue * OFFICIAL_SELL_RATE).toFixed())}₴)
								</span>
								;
							</li>
							<li>
								Місячні витрати{' '}
								<span className='monthly-budget-color'>
									{formatToUsNumber(+monthlyBudgetValue)}₴ (
									{formatToUsNumber(+(monthlyBudgetValue / OFFICIAL_BUY_RATE).toFixed())}$){' '}
								</span>
								;
							</li>
							<li>
								Можливо відкласти{' '}
								<span className='after-deposit-color'>
									{formatToUsNumber(afterDeposit)}₴ (
									{formatToUsNumber(+(afterDeposit / officialRateValue).toFixed())}$){' '}
								</span>
								;
							</li>
						</ul>
					</div>
				</>
			)}
		</div>
	);
};

export default App;
