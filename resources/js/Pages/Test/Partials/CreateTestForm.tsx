// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
// import TextInput from '@/Components/TextInput';
// import { Test } from '@/types/test';
import Button from '@/Components/ui/Button';
import { useForm, SubmitHandler } from "react-hook-form"
import Input from '@/Components/ui/Input';
import FieldWrapper from '@/Components/ui/FieldWrapper';
// import { Spinner } from 'flowbite-react';

type Inputs = {
  title: string;
  description: string;
  tags: string[];
  questions: string[];
}


export default function CreateTestForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<Inputs>()

      const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <FieldWrapper>
                <Input
                    register={register}
                    label="Title"
                    name="title"
                    id="title"
                    error={errors.title?.type === "required" && 'Title is required'}
                    required
                />
            </FieldWrapper>

            <FieldWrapper>
                <Button type="submit" color="green">Save</Button>
            </FieldWrapper>

            {/* <div className="mt-4">
                <InputLabel htmlFor="password" value="Password" />

                <TextInput
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="mt-1 block w-full"
                    autoComplete="current-password"
                    onChange={(e) => setData('password', e.target.value)}
                />

                <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="block mt-4">
                <label className="flex items-center">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <span className="ms-2 text-sm text-gray-600">Remember me</span>
                </label>
            </div>

            <div className="flex items-center justify-end mt-4">
                {canResetPassword && (
                    <Link
                        href={route('password.request')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Forgot your password?
                    </Link>
                )}

                <PrimaryButton className="ms-4" disabled={processing}>
                    Log in
                </PrimaryButton>
            </div> */}
        </form>
    );
}
