import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Transition,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import apiService from '../services/apiService.ts';
import { useAuth } from '../infra/auth-provider.tsx';

const Login = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setUser } = useAuth();
  const loginForm = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'מייל לא תקין'),
      password: (val) => (val.length < 6 ? 'סיסמא צריכה להיות מעל 5 תווים' : null),
    },
  });

  const registerForm = useForm({
    initialValues: {
      email: '',
      password: '',
      verifyPassword: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'מייל לא תקין'),
      password: (val) => (val.length < 6 ? 'סיסמא צריכה להיות מעל 5 תווים' : null),
      verifyPassword: (val, form) => (val !== form.password ? 'סיסמאות לא תואמות' : null),
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 250);
  }, []);

  return (
    <Transition mounted={mounted} transition="fade" duration={400} timingFunction="ease">
      {(styles) => (
        <Container style={styles} size={420} my={40}>
          <Title ta="center">ברוכים הבאים!</Title>
          {!isRegisterMode && (
            <Text c="dimmed" size="sm" ta="center" mt={5}>
              עדיין אין לך משתמש?{' '}
              <Anchor size="sm" component="button" onClick={() => setIsRegisterMode(true)}>
                להרשמה לחץ כאן
              </Anchor>
            </Text>
          )}

          {!isRegisterMode ? (
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
              <form
                onSubmit={loginForm.onSubmit((values) =>
                  apiService.auth.login(values).then((res) => {
                    setUser(res);
                    if (values.rememberMe) {
                      localStorage.setItem('user', JSON.stringify(res));
                    }
                  }),
                )}
              >
                <TextInput
                  label="אימייל"
                  placeholder="you@alona.com"
                  withAsterisk
                  key={loginForm.key('email')}
                  {...loginForm.getInputProps('email')}
                />
                <PasswordInput
                  label="סיסמא"
                  placeholder="123456"
                  mt="md"
                  withAsterisk
                  key={loginForm.key('password')}
                  {...loginForm.getInputProps('password')}
                />
                <Group justify="space-between" mt="lg">
                  <Checkbox
                    label="זכור אותי"
                    key={loginForm.key('rememberMe')}
                    {...loginForm.getInputProps('rememberMe', { type: 'checkbox' })}
                  />
                  <Anchor component="button" size="sm">
                    שכחת סיסמא?
                  </Anchor>
                </Group>
                <Button fullWidth mt="xl" type="submit">
                  התחבר
                </Button>
                <Button fullWidth mt="sm" variant="outline" onClick={() => setIsRegisterMode(true)}>
                  להרשמה לחץ כאן
                </Button>
              </form>
            </Paper>
          ) : (
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
              <form
                onSubmit={registerForm.onSubmit((values) =>
                  apiService.auth.register(values).then((res) => setUser(res)),
                )}
              >
                <TextInput
                  label="אימייל"
                  placeholder="you@alona.com"
                  withAsterisk
                  key={registerForm.key('email')}
                  {...registerForm.getInputProps('email')}
                />
                <PasswordInput
                  label="סיסמא"
                  placeholder="123456"
                  mt="md"
                  withAsterisk
                  key={registerForm.key('password')}
                  {...registerForm.getInputProps('password')}
                />
                <PasswordInput
                  label="אימות סיסמא"
                  placeholder="123456"
                  mt="md"
                  withAsterisk
                  key={registerForm.key('verifyPassword')}
                  {...registerForm.getInputProps('verifyPassword')}
                />
                <Button fullWidth mt="xl" type="submit">
                  הירשם
                </Button>
                <Button fullWidth mt="sm" variant="outline" onClick={() => setIsRegisterMode(false)}>
                  משתמש קיים?
                </Button>
              </form>
            </Paper>
          )}
        </Container>
      )}
    </Transition>
  );
};

export default Login;
