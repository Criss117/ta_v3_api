export async function sleep(ms = 500) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
