export const Auth = ({
  login,
  username,
  password,
  setUsername,
  setPassword,
}: {
  login: () => void
  username: string
  password: string
  setUsername: (value: string) => void
  setPassword: (value: string) => void
}) => {
  return (
    <div className={'border border-primary bg-white max-w-[350px] p-10 mx-auto'}>
      <h2 className={'text-md1 mb-5'}>{'Login'}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          login()
        }}
      >
        <input
          className={'form-input'}
          value={username}
          placeholder={'Username'}
          onChange={(e) => setUsername(e.target.value)}
          type={'text'}
        />
        <input
          className={'form-input'}
          value={password}
          placeholder={'Password'}
          onChange={(e) => setPassword(e.target.value)}
          type={'password'}
        />
        <button type={'submit'} className={'button-primary'}>
          {'Login'}
        </button>
      </form>
    </div>
  )
}
