export const twClass = (...props: (string | false | null | undefined)[]) => {
  const filtered = props.filter((c) => !!c);
  return filtered.join(" ");
};
