export default function bemCx(options = {}) {
  let {block, element, namespace, modifiers, states} = options;
  let bemClasses = [];
  let baseClassName;

  if (element) {
    if (namespace) {
      baseClassName = `${ namespace }-${ block }__${ element }`;
    } else {
      baseClassName = `${ block }__${ element }`;
    }
  } else {
    if (namespace) {
      baseClassName = `${ namespace }-${ block }`;
    } else {
      baseClassName = block;
    }
  }

  bemClasses.push(baseClassName);

  if (states) {
    if (typeof states === 'object') {
      states = Object.keys(states).filter(s => states[s]);
    }

    states.forEach(function(state) {
      bemClasses.push(`${ baseClassName }--is-${ state }`);
    });
  }

  if (modifiers) {
    if (typeof modifiers === 'object') {
      modifiers = Object.keys(modifiers).filter(m => modifiers[m]);
    }

    modifiers.forEach(function(modifier) {
      bemClasses.push(`${ baseClassName }--${ modifier }`);

      if (states) {
        states.forEach(function(state) {
          bemClasses.push(`${ baseClassName }--${ modifier }--is-${ state }`);
        });
      }
    });
  }

  return bemClasses.join(' ');
}
