import React from 'react';
import { UseFormRegister } from 'react-hook-form';

import './style.scss';

type InputProps = {
	label: string;
	name: string;
	register: UseFormRegister<any>;
	currencyName: 'dollar' | 'gryvna';
	step: number | string;
	type?: string;
};

const CommonInput = (props: InputProps) => {
	const { label, name, type, register, currencyName, step } = props;

	return (
		<div className='common-input'>
			<label className='common-input__label' htmlFor='name'>
				{label} :
			</label>
			<input
				className='common-input__input'
				autoComplete='off'
				type={type ? type : 'tel'}
				{...register(name)}
				step={step}
			/>
			{currencyName === 'dollar' ? '$' : '₴'}
		</div>
	);
};

export default CommonInput;
