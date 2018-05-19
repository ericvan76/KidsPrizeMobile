import { Alert } from 'react-native';
import { clearErrors } from 'src/actions/requestState';

let errorInDisplay: boolean = false;

export function displayErrors(errors: Record<string, Error>, clearAction: typeof clearErrors): void {
  if (errorInDisplay) {
    return;
  }
  if (Object.keys(errors).length > 0) {
    let title = 'Service is not available';
    let message = 'We\'re working on this, please try again later.';
    if (__DEV__) {
      const err = Object.keys(errors).reduce(
        (p: Record<string, string>, c: string) => {
          p[c] = errors[c].message;
          return p;
        },
        {});
      title = 'Ooops';
      message = JSON.stringify(err);
    }
    errorInDisplay = true;
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK', onPress: () => {
            errorInDisplay = false;
            clearAction(undefined);
          }
        }
      ],
      { cancelable: false }
    );
  }
}
