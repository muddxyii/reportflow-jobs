import {PDFDocument, PDFForm} from "pdf-lib";

interface FieldExtractor<T> {
    extract(form: PDFForm, fieldName: string): T;
}

class TextFieldExtractor implements FieldExtractor<string> {
    extract(form: PDFForm, fieldName: string): string {
        const field = form.getTextField(fieldName);
        return field?.getText() || '';
    }
}

class DropdownFieldExtractor implements FieldExtractor<string> {
    extract(form: PDFForm, fieldName: string): string {
        const field = form.getDropdown(fieldName);
        return field?.getSelected()?.[0] || '';
    }
}

class CheckboxFieldExtractor implements FieldExtractor<string> {
    extract(form: PDFForm, fieldName: string): string {
        const field = form.getCheckBox(fieldName);
        return field?.isChecked() ? 'true' : 'false';
    }
}

export class PDFFieldExtractor {
    private readonly extractors: {
        [key: string]: FieldExtractor<string>;
    };

    constructor() {
        this.extractors = {
            text: new TextFieldExtractor(),
            dropdown: new DropdownFieldExtractor(),
            checkbox: new CheckboxFieldExtractor(),
        };
    }

    async extractFields(pdf: File, fields: {
        text?: string[];
        dropdown?: string[];
        checkbox?: string[];
    }): Promise<{
        text: Record<string, string>;
        dropdown: Record<string, string>;
        checkbox: Record<string, boolean>;
    }> {
        const arrayBuffer = await pdf.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const form = pdfDoc.getForm();

        const result = {
            text: {},
            dropdown: {},
            checkbox: {},
        };

        if (fields.text?.length) {
            result.text = this.extractFieldGroup(form, fields.text, this.extractors.text);
        }

        if (fields.dropdown?.length) {
            result.dropdown = this.extractFieldGroup(form, fields.dropdown, this.extractors.dropdown);
        }

        if (fields.checkbox?.length) {
            result.checkbox = this.extractFieldGroup(form, fields.checkbox, this.extractors.checkbox);
        }

        return result;
    }

    private extractFieldGroup<T>(
        form: PDFForm,
        fieldNames: string[],
        extractor: FieldExtractor<T>
    ): Record<string, T> {
        return fieldNames.reduce((acc, fieldName) => {
            acc[fieldName] = extractor.extract(form, fieldName);
            return acc;
        }, {} as Record<string, T>);
    }
}