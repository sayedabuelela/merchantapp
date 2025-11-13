export const logJSON = (label: string, data: any) => {
    console.log(`${label}:`, JSON.stringify(data, null, 2));
  };