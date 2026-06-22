type CsvValue = string | number | null | undefined;

type CsvTransaction = {
  date: string;
  description: string;
  notes?: string | null;
  category: string;
  amount: number;
  responsible: string;
  division: string;
  type: string;
};

function escapeCsv(value: CsvValue) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export function downloadTransactionsCsv(
  transactions: CsvTransaction[],
  fileName = "coupledin-lancamentos.csv",
) {
  const columns = [
    ["date", "Data"],
    ["description", "Descrição"],
    ["notes", "Observações"],
    ["category", "Categoria"],
    ["amount", "Valor"],
    ["responsible", "Responsável"],
    ["division", "Divisão"],
    ["type", "Tipo"],
  ] as const;

  const rows = [
    columns.map(([, label]) => escapeCsv(label)).join(","),
    ...transactions.map((transaction) =>
      columns.map(([key]) => escapeCsv(transaction[key])).join(","),
    ),
  ];

  const blob = new Blob([`\uFEFF${rows.join("\n")}`], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
