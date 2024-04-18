from openpyxl import load_workbook


def read_data_from_excel(file_path):
    set_provincias = set()

    wb = load_workbook(filename=file_path)
    sheet = wb.active

    for row in sheet.iter_rows(min_row=2, values_only=True):
        provincia = row[7]
        set_provincias.add(provincia)
    
    return set_provincias

# Ejemplo de uso
if __name__ == "__main__":
    file_path = "Localidades.xlsx"
    provincias = read_data_from_excel(file_path)
    for provincia in provincias:
        print(f" Nombre: {provincia}")
