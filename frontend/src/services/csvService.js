import { fetchApi } from "./api";

export async function testCsvFile(file, model = "random_forest") {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetchApi(`/predictions/csv?model=${encodeURIComponent(model)}`, {
    method: "POST",
    body: formData,
    timeout: 120000,
  });
  return response?.data ?? response;
}
