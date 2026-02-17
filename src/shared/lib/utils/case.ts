/**
 * snake_case 객체를 camelCase 객체로 재귀적으로 변환하는 유틸리티
 */
export const toCamelCase = <T>(obj: any): T => {
  if (Array.isArray(obj)) {
    return obj.map((v) => toCamelCase(v)) as any;
  } else if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/([-_][a-z])/gi, ($1) =>
        $1.toUpperCase().replace('-', '').replace('_', '')
      );
      return {
        ...result,
        [camelKey]: toCamelCase(obj[key]),
      };
    }, {}) as any;
  }
  return obj;
};
