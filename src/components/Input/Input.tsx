import { theme } from "../../styles/theme";
import Icon from "../../utils/getIcons";
import { InputComponent, Container, InputWrapper } from "./styles"


interface IInputProps {
  type: string;
  label?: string;
  iconName: string;
  placeholder: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}


export const Input = ({ type, iconName, placeholder, onChange, value }: IInputProps) => {

  

  return (
    <Container>
      <InputWrapper>
      <Icon iconType={iconName} color={theme.colors.primary} />
      </InputWrapper>
      <InputComponent placeholder={placeholder} type={type} onChange={onChange} value={value} />
    </Container>
  )
}
