import { type ChangeEvent, useCallback } from "react";

import { Input } from "../input";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

type FormInputProps = React.ComponentProps<"input"> & FormControlProps;

export function FormInput(props: FormInputProps) {
	const field = useFieldContext<string>();
	const isInvalid =
		props["aria-invalid"] === true ||
		props["aria-invalid"] === "true" ||
		(field.state.meta.isTouched && !field.state.meta.isValid);
	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			field.handleChange(event.target.value);
		},
		[field]
	);

	return (
		<FormBase {...props}>
			<Input
				{...props}
				aria-invalid={isInvalid}
				id={field.name}
				name={field.name}
				onBlur={field.handleBlur}
				onChange={handleChange}
				value={field.state.value}
			/>
		</FormBase>
	);
}
