export const getCssVar = (variable: string) => {
  const body = document.querySelector('body.dark');

  if (!body) return getComputedStyle(document.documentElement).getPropertyValue(variable);

  return getComputedStyle(body).getPropertyValue(variable);
};

export const setCssVar = (variable: string, value: string) => {
  document.documentElement.style.setProperty(variable, value);
};
