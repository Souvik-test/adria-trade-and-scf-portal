import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { TABLE_SCHEMAS, DATABASE_MODULES, TableSchema, ModuleInfo } from "./databaseSchema";

const createTableHeader = (headers: string[]) => {
  return new TableRow({
    tableHeader: true,
    children: headers.map(header => 
      new TableCell({
        shading: { fill: "1e40af" },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: header,
                bold: true,
                color: "FFFFFF",
                size: 20
              })
            ]
          })
        ],
        width: { size: 100 / headers.length, type: WidthType.PERCENTAGE }
      })
    )
  });
};

const createTableRow = (cells: string[]) => {
  return new TableRow({
    children: cells.map(cell => 
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: cell,
                size: 18
              })
            ]
          })
        ],
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
          left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
          right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }
        }
      })
    )
  });
};

const createModuleSection = (module: ModuleInfo, tables: TableSchema[]) => {
  const sections: (Paragraph | Table)[] = [];
  
  // Module heading
  sections.push(
    new Paragraph({
      text: module.name,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 }
    })
  );
  
  // Module description
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: module.description,
          italics: true,
          size: 22
        })
      ],
      spacing: { after: 300 }
    })
  );
  
  // Tables in this module
  tables.forEach(table => {
    // Table name heading
    sections.push(
      new Paragraph({
        text: table.name,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 }
      })
    );
    
    // Table description
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: table.description,
            size: 20
          })
        ],
        spacing: { after: 200 }
      })
    );
    
    // Column table
    const columnTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createTableHeader(["Column Name", "Data Type", "Nullable", "Default Value"]),
        ...table.columns.map(col => 
          createTableRow([
            col.name,
            col.type,
            col.nullable ? "Yes" : "No",
            col.defaultValue || "-"
          ])
        )
      ]
    });
    
    sections.push(columnTable);
    
    // Foreign keys if any
    if (table.foreignKeys && table.foreignKeys.length > 0) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Foreign Keys:",
              bold: true,
              size: 20
            })
          ],
          spacing: { before: 150, after: 100 }
        })
      );
      
      table.foreignKeys.forEach(fk => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${fk.column} → ${fk.references}`,
                size: 18
              })
            ],
            spacing: { after: 50 }
          })
        );
      });
    }
  });
  
  return sections;
};

export const generateDatabaseDocx = async () => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title
        new Paragraph({
          text: "Trade Finance Platform",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: "Database Technical Documentation",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),
        
        // Generated date
        new Paragraph({
          children: [
            new TextRun({
              text: `Generated: ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}`,
              size: 20
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 }
        }),
        
        // Table of Contents placeholder
        new Paragraph({
          text: "Table of Contents",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),
        
        // List modules
        ...DATABASE_MODULES.map((module, index) => 
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. ${module.name} (${module.tables.length} tables)`,
                size: 22
              })
            ],
            spacing: { after: 100 }
          })
        ),
        
        // Page break
        new Paragraph({
          pageBreakBefore: true
        }),
        
        // Executive Summary
        new Paragraph({
          text: "Executive Summary",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `This document provides comprehensive technical documentation for the Trade Finance Platform database schema. The database consists of ${TABLE_SCHEMAS.length} tables organized into ${DATABASE_MODULES.length} functional modules, supporting various trade finance operations including Letters of Credit, Bank Guarantees, Documentary Collections, Remittances, and Supply Chain Finance.`,
              size: 22
            })
          ],
          spacing: { after: 300 }
        }),
        
        // Summary table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createTableHeader(["Module", "Tables", "Description"]),
            ...DATABASE_MODULES.map(module => 
              createTableRow([
                module.name,
                module.tables.length.toString(),
                module.description
              ])
            )
          ]
        }),
        
        // Page break before detailed sections
        new Paragraph({
          pageBreakBefore: true
        }),
        
        // Detailed module sections
        ...DATABASE_MODULES.flatMap(module => {
          const moduleTables = TABLE_SCHEMAS.filter(t => t.module === module.name);
          return createModuleSection(module, moduleTables);
        })
      ]
    }]
  });
  
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Database_Documentation_${new Date().toISOString().split('T')[0]}.docx`);
};

export const generateDatabaseJSON = () => {
  const data = {
    generatedAt: new Date().toISOString(),
    totalTables: TABLE_SCHEMAS.length,
    modules: DATABASE_MODULES.map(module => ({
      ...module,
      tables: TABLE_SCHEMAS.filter(t => t.module === module.name)
    }))
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  saveAs(blob, `Database_Schema_${new Date().toISOString().split('T')[0]}.json`);
};
