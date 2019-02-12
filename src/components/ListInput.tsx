import React from 'react';
import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

interface Props extends TextInputProps {
  label: string;
  message?: string;
  hasError?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelContainerStyle?: StyleProp<ViewStyle>;
  hasTextInput?: boolean;
}

const ListInput: React.FunctionComponent<Props> = ({
  label,
  message,
  hasError,
  style,
  containerStyle,
  labelContainerStyle,
  hasTextInput,
  ...rest
}) => (
  <View style={[styles.container, containerStyle]}>
    <View style={[styles.labelContainer, labelContainerStyle]}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>

      {!!message && (
        <Text style={styles.message} numberOfLines={1}>
          {message}
        </Text>
      )}
    </View>

    {hasTextInput !== false && (
      <TextInput
        autoCapitalize="sentences"
        keyboardAppearance="dark"
        keyboardType="email-address"
        placeholderTextColor={EStyleSheet.value('$textColorFaded')}
        spellCheck={false}
        textContentType="URL"
        underlineColorAndroid="transparent"
        style={[styles.input, hasError && styles.inputError, style]}
        {...rest}
      />
    )}
  </View>
);

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },

  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    paddingBottom: 0,
  },
  label: {
    flex: 1,
    color: '$textColor',
    fontSize: '$fontSizeLg',
  },
  message: {
    color: '$brandDanger',
    fontSize: '$fontSizeSm',
  },

  input: {
    width: null,
    backgroundColor: '$bgColorContrast',
    marginHorizontal: 12,
    marginVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderColor: 'rgba(0,0,0,0.4)',
    borderWidth: EStyleSheet.hairlineWidth,
    color: '$textColor',
    fontSize: '$fontSize',
  },

  inputError: {
    borderColor: '$brandDanger',
  },
});

export default ListInput;
