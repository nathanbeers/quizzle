import logo from '../../images/quizzle.png'

type ImgProps = {
    className?: string;
}

export default function ApplicationLogo({ className }: ImgProps) {
    return (
        <img src={logo} alt='Quizzle logo' className={className} />
    );
}
