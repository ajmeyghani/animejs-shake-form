const callApi = () => (new Promise((r, j) => setTimeout(r, 1000)));

const fade = (t, conf) => {
  const defaults = {
    duration: 80,
    easing: 'linear',
  };
  const settings = Object.assign(defaults, conf);
  return anime({
    targets: t,
    duration: settings.duration,
    easing: settings.easing,
    autoplay: false,
    opacity: settings.opacity,
  });
};

const spin = (t, conf) => {
  const defaults = {
    duration: 450,
    easing: 'linear',
  };
  const settings = Object.assign(defaults, conf);
  return anime({
    targets: t,
    begin: () => {
      fade(t, {opacity: 1}).play();
    },
    duration: settings.duration,
    easing: settings.easing,
    loop: true,
    autoplay: false,
    rotate: '+=360deg',
  });
};

const newFormAnim = () => {
  const elms = {
    form: document.querySelector('#js-login-form'),
    inputs: document.querySelectorAll('.form-group input'),
  };

  const colors = {
    primary: '#5059d8',
    fail: '#f7733f',
    success: '#11d402',
    mute: '#e0e0e0',
  };

  const shakeAnim = (t, conf) => {
    const defaults = {
      duration: 550,
      xMax: 16,
      easing: 'easeInOutSine',
    };
    const settings = Object.assign(defaults, conf);
    const xMax = settings.xMax;
    return anime({
      targets: t,
      easing: settings.easing,
      duration: settings.duration,
      translateX: [
        {
          value: xMax * -1,
        },
        {
          value: xMax,
        },
        {
          value: xMax/-2,
        },
        {
          value: xMax/2,
        },
        {
          value: 0
        }
      ],
      autoplay: false,
    });
  };

  const borderTopAnim = (t, conf) => {
    const defaults = {
      easing: 'easeInOutSine',
      duration: 500,
    };
    const settings = Object.assign(defaults, conf);
    return anime({
      targets: t,
      easing: settings.easing,
      duration: settings.duration,
      borderTopColor: [settings.startColor, settings.endColor].filter(v => v),
      autoplay: false,
    });
  };

  const inputsAnim = (t, conf) => {
    const defaults = {
      duration: 400,
      easing: 'easeInOutSine',
    };
    const settings = Object.assign(defaults, conf);
    return anime({
      targets: t,
      easing: settings.easing,
      duration: settings.duration,
      autoplay: false,
      borderColor: [settings.startColor, settings.endColor].filter(v => v),
    });
  };

  const failAnims = {
    borderTop: borderTopAnim(elms.form, {
      endColor: colors.fail,
    }),
    formShake: shakeAnim(elms.form),
    inputs: inputsAnim(elms.inputs, {
      endColor: colors.fail,
    }),
  };

  const successAnims = {
    borderTop: borderTopAnim(elms.form, {
      endColor: colors.success,
    }),
    inputs: inputsAnim(elms.inputs, {
      endColor: colors.success,
    }),
  };

  return {
    failAnims,
    successAnims,
    borderTopAnim,
    inputsAnim,
    shakeAnim,
    elms,
    colors,
  };
};

const newSpinner = () => {
  const elm = document.querySelector('.js-spinner');
  const spinAnim = spin(elm);
  return {
    elm, spinAnim,
  }
};

let didPlay = false;
let = inputCount = 0;
const isFail = document.querySelector('#js-toggle');
const formAnim = newFormAnim();

const playFormFail = () => {
  formAnim.failAnims.formShake.restart();
  formAnim.failAnims.inputs.restart();
  formAnim.failAnims.borderTop.restart();
};

const playFormSuccess = () => {
  formAnim.successAnims.inputs.restart();
  formAnim.successAnims.borderTop.restart();
};

const playFormReset = () => {
  const elms = formAnim.elms;
  const inputStartColor = elms.inputs[0].style.border;
  const formTopColor = elms.form.style.borderTop;

  formAnim.inputsAnim(elms.inputs, {
    startColor: inputStartColor,
    endColor: formAnim.colors.mute,
  }).play();

  formAnim.borderTopAnim(elms.form, {
    startColor: formTopColor,
    endColor: formAnim.colors.primary,
  }).play();
};

const send = () => {
  didPlay = true;
  inputCount = 0;
  const spinner = newSpinner();
  spinner.spinAnim.play();
  playFormReset();
  callApi()
  .then(r => {
    if(isFail.checked) {
      fade(spinner.elm, {opacity: 0}).play();
      playFormFail();
    } else {
      fade(spinner.elm, {opacity: 0}).play();
      playFormSuccess();
    }
  });
};

formAnim.elms.inputs.forEach(n => {
  n.addEventListener('input', e => {
    if(didPlay) inputCount += 1;
    if(didPlay && inputCount <= 1) {
      playFormReset();
    }
  });
});
