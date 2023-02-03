import React from 'react';
import { UseFormRegister } from 'react-hook-form';

import './style.scss';

type InputProps = {
	label: string;
	name: string;
	register: UseFormRegister<any>;
	currencyName: 'dollar' | 'gryvna';
};

const CommonInput = (props: InputProps) => {
	const { label, name, register, currencyName } = props;

	return (
		<div className='common-input'>
			<label className='common-input__label' htmlFor='name'>
				{label} :
			</label>
			<input
				className='common-input__input'
				autoComplete='off'
				type='number'
				{...register(name)}
				step='0.1'
			/>
			{currencyName === 'dollar' ? '$' : '₴'}
		</div>
	);
};

export default CommonInput;
