interface SignInDto {
  username: string;
  password: string;
}

interface SignUpDto {
  name: string;
  email: string;
  password: string;
}

export {
  SignInDto,
  SignUpDto
};
