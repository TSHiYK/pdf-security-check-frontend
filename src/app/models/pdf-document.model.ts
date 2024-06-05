export interface PdfDocument {
    pdfUrl: string;
    fileName: string;
    pdfProperties: PdfProperties;
}

export interface PdfProperties {
    document: Document;
    security_info: SecurityInfo;
    pages: Page[];
}

export interface Document {
    is_linearized: boolean;
    is_tagged: boolean;
    is_portfolio: boolean;
    is_certified: boolean;
    is_encrypted: boolean;
    info_dict: InfoDict;
    is_FTPDF: boolean;
    pdf_version: string;
    has_acroform: boolean;
    file_size: string;
    is_signed: boolean;
    incremental_save_count: number;
    has_embedded_files: boolean;
    is_XFA: boolean;
    fonts: Font[];
    pdfa_compliance_level: string | null;
    pdfe_compliance_level: string | null;
    pdfua_compliance_level: string | null;
    pdfvt_compliance_level: string | null;
    pdfx_compliance_level: string | null;
    XMP: string;
    page_count: number;
}

export interface InfoDict {
    CreationDate: string | null;
    Producer: string | null;
    Creator: string | null;
    ModDate: string | null;
    Author: string | null;
    Title: string | null;
}

export interface Font {
    name: string;
    font_type: string;
    family_name: string;
}

export interface SecurityInfo {
    encryption: Encryption;
    permissions: Permissions;
}

export interface Encryption {
    encrypt_attachments_only: boolean;
    has_owner_password: boolean;
    encrypt_metadata: boolean;
    has_user_password: boolean;
    bit_length: number;
    algorithm: string;
}

export interface Permissions {
    assistive_technology: boolean;
    form_filling: boolean;
    copying: boolean;
    page_extraction: boolean;
    document_assembly: boolean;
    commenting: boolean;
    printing: string;
    editing: boolean;
}

export interface Page {
    page_number: number;
    is_scanned: boolean;
    width: number;
    has_structure: boolean;
    content: Content;
    height: number;
}

export interface Content {
    number_of_images: number;
    only_images: boolean;
    has_text: boolean;
    has_images: boolean;
    is_empty: boolean;
}
