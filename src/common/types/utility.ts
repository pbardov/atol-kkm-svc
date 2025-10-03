export type OtherProps<T, K extends keyof T> = Exclude<keyof T, K>;
export type RequiredProps<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export type PartialProps<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type UnionFromArray<T extends readonly any[]> = T[number];
