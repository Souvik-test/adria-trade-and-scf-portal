import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  PageBreak,
  TableOfContents,
  StyleLevel,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
} from 'docx';
import { saveAs } from 'file-saver';

// Helper to create a styled heading
const createHeading = (text: string, level: typeof HeadingLevel[keyof typeof HeadingLevel]) => {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 400, after: 200 },
  });
};

// Helper to create a paragraph
const createParagraph = (text: string, bold = false) => {
  return new Paragraph({
    children: [new TextRun({ text, bold })],
    spacing: { after: 120 },
  });
};

// Helper to create bullet points
const createBulletPoint = (text: string) => {
  return new Paragraph({
    children: [new TextRun({ text })],
    bullet: { level: 0 },
    spacing: { after: 80 },
  });
};

// Helper to create a table
const createTable = (headers: string[], rows: string[][]) => {
  const headerRow = new TableRow({
    children: headers.map(
      (header) =>
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: header, bold: true })] })],
          shading: { fill: 'E0E0E0' },
        })
    ),
    tableHeader: true,
  });

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [new Paragraph({ text: cell })],
            })
        ),
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
      insideVertical: { style: BorderStyle.SINGLE, size: 1 },
    },
    rows: [headerRow, ...dataRows],
  });
};

// Create section with page break
const createSectionBreak = () => {
  return new Paragraph({
    children: [new PageBreak()],
  });
};

export const generateSpecificationDocument = async () => {
  const doc = new Document({
    title: 'Dynamic Form Engine & NextGen Workflow Configurator - Technical Specification',
    description: 'Complete technical specification for the Dynamic Form Engine and NextGen Workflow Configurator',
    creator: 'Adria Trade Studio',
    styles: {
      default: {
        heading1: {
          run: { size: 32, bold: true, color: '2E74B5' },
          paragraph: { spacing: { before: 400, after: 200 } },
        },
        heading2: {
          run: { size: 26, bold: true, color: '2E74B5' },
          paragraph: { spacing: { before: 300, after: 150 } },
        },
        heading3: {
          run: { size: 22, bold: true },
          paragraph: { spacing: { before: 200, after: 100 } },
        },
      },
    },
    sections: [
      {
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Dynamic Form Engine & NextGen Workflow Configurator - Technical Specification',
                    size: 18,
                    color: '666666',
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Page ' }),
                  new TextRun({ children: [PageNumber.CURRENT] }),
                  new TextRun({ text: ' of ' }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES] }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children: [
          // Cover Page
          new Paragraph({ spacing: { before: 2000 } }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Dynamic Form Engine',
                bold: true,
                size: 56,
                color: '2E74B5',
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '&',
                size: 40,
                color: '666666',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'NextGen Workflow Configurator',
                bold: true,
                size: 56,
                color: '2E74B5',
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ spacing: { before: 600 } }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Technical Specification Document',
                size: 32,
                italics: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ spacing: { before: 1000 } }),
          new Paragraph({
            children: [new TextRun({ text: 'Version 1.0', size: 24 })],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [new TextRun({ text: `Generated: ${new Date().toLocaleDateString()}`, size: 24 })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: 'Adria Trade Studio', size: 24, color: '666666' })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 },
          }),

          createSectionBreak(),

          // Table of Contents
          createHeading('Table of Contents', HeadingLevel.HEADING_1),
          new TableOfContents('Table of Contents', {
            hyperlink: true,
            headingStyleRange: '1-3',
            stylesWithLevels: [
              new StyleLevel('Heading1', 1),
              new StyleLevel('Heading2', 2),
              new StyleLevel('Heading3', 3),
            ],
          }),

          createSectionBreak(),

          // 1. Executive Summary
          createHeading('1. Executive Summary', HeadingLevel.HEADING_1),
          createParagraph(
            'This document provides a comprehensive technical specification for the Dynamic Form Engine and NextGen Workflow Configurator system. These interconnected modules enable administrators to configure dynamic, workflow-driven transaction forms without code changes.'
          ),
          createHeading('1.1 System Overview', HeadingLevel.HEADING_2),
          createParagraph(
            'The system consists of two main components that work together to provide a flexible, configurable platform for trade finance operations:'
          ),
          createBulletPoint(
            'Dynamic Form Engine: Handles product-event mapping, pane/section configuration, and field definitions'
          ),
          createBulletPoint(
            'NextGen Workflow Configurator: Manages workflow templates, stages, field assignments, and business conditions'
          ),

          createHeading('1.2 Key Features', HeadingLevel.HEADING_2),
          createBulletPoint('No-code form configuration through administrative UI'),
          createBulletPoint('Multi-stage workflow support with stage-specific field visibility'),
          createBulletPoint('Cross-workflow handoff between Portal and Bank workflows'),
          createBulletPoint('Role-based access control at stage level'),
          createBulletPoint('Repeatable sections for variable-length data entry'),
          createBulletPoint('Excel bulk upload for field definitions'),

          createSectionBreak(),

          // 2. System Architecture
          createHeading('2. System Architecture Overview', HeadingLevel.HEADING_1),
          createParagraph(
            'The system follows a three-stage configuration journey that enables dynamic UI generation at runtime:'
          ),
          createHeading('2.1 Configuration Flow', HeadingLevel.HEADING_2),
          createParagraph('Stage 1: Field Repository Configuration', true),
          createBulletPoint(
            'Administrators define fields for specific Product-Event-Pane-Section combinations'
          ),
          createBulletPoint('Fields include grid coordinates, data types, validation rules'),
          createParagraph('Stage 2: Workflow Template Configuration', true),
          createBulletPoint('Create workflow templates with Product-Event-Trigger combinations'),
          createBulletPoint('Define workflow stages (Data Entry, Limit Check, Approval, etc.)'),
          createBulletPoint('Map fields from Field Repository to each stage'),
          createParagraph('Stage 3: Runtime UI Generation', true),
          createBulletPoint('System matches transaction context to workflow template'),
          createBulletPoint('Retrieves configured stages, panes, sections, and fields'),
          createBulletPoint('Dynamically generates form UI based on configuration'),

          createHeading('2.2 Component Relationships', HeadingLevel.HEADING_2),
          createTable(
            ['Component', 'Depends On', 'Produces'],
            [
              ['Product Event Mapping', 'Product definitions', 'Event configurations per audience'],
              ['Pane Section Mappings', 'Product Event Mapping', 'UI structure (panes, sections, grid layout)'],
              ['Field Repository', 'Pane Section Mappings', 'Field definitions with coordinates'],
              ['Workflow Templates', 'Product Event Mapping', 'Workflow configurations'],
              ['Workflow Stages', 'Workflow Templates', 'Stage definitions with actors'],
              ['Workflow Stage Fields', 'Workflow Stages, Field Repository', 'Stage-specific field assignments'],
              ['Dynamic Transaction Form', 'All above', 'Runtime form UI'],
            ]
          ),

          createSectionBreak(),

          // 3. Dynamic Form Engine
          createHeading('3. Dynamic Form Engine', HeadingLevel.HEADING_1),
          createParagraph(
            'The Dynamic Form Engine provides administrative tools for configuring the structure and content of transaction forms.'
          ),

          createHeading('3.1 Product Event Mapping', HeadingLevel.HEADING_2),
          createHeading('3.1.1 Purpose', HeadingLevel.HEADING_3),
          createParagraph(
            'Defines which events are available for each product, with target audience differentiation. Enables different product/event names for different business applications.'
          ),
          createHeading('3.1.2 UI Description', HeadingLevel.HEADING_3),
          createBulletPoint('Module selector dropdown (TF - Trade Finance, SCF - Supply Chain Finance)'),
          createBulletPoint('Table displaying all product-event combinations'),
          createBulletPoint('Add Mapping button for creating audience-specific configurations'),
          createBulletPoint('Map to Panes and Sections action icon for navigation'),

          createHeading('3.1.3 Database Schema', HeadingLevel.HEADING_3),
          createParagraph('Table: product_event_mapping', true),
          createTable(
            ['Column', 'Type', 'Description'],
            [
              ['id', 'UUID', 'Primary key'],
              ['module_code', 'TEXT', 'Module code (TF, SCF)'],
              ['module_name', 'TEXT', 'Module display name'],
              ['product_code', 'TEXT', 'Product code (ILC, ELC, IBG, etc.)'],
              ['product_name', 'TEXT', 'Product display name'],
              ['event_code', 'TEXT', 'Event code (ISS, AMD, CAN, etc.)'],
              ['event_name', 'TEXT', 'Event display name'],
              ['target_audience', 'TEXT[]', 'Target audiences (Corporate, Bank, Agent)'],
              ['business_application', 'TEXT[]', 'Business applications'],
              ['user_id', 'UUID', 'Creator user ID'],
              ['created_at', 'TIMESTAMP', 'Creation timestamp'],
              ['updated_at', 'TIMESTAMP', 'Last update timestamp'],
            ]
          ),

          createHeading('3.2 Manage Panes and Sections', HeadingLevel.HEADING_2),
          createHeading('3.2.1 Purpose', HeadingLevel.HEADING_3),
          createParagraph(
            'Configures the UI structure for specific product-event combinations, defining panes (major UI areas) and sections (subdivisions within panes) with grid layouts.'
          ),
          createHeading('3.2.2 UI Description', HeadingLevel.HEADING_3),
          createBulletPoint('Cascading selection: Business Application → Customer Segment → Product → Event'),
          createBulletPoint('Dashboard displaying existing configurations as clickable cards'),
          createBulletPoint('Pane management with drag-and-drop reordering'),
          createBulletPoint('Section management within each pane'),
          createBulletPoint('Grid layout configuration (rows/columns) per section'),
          createBulletPoint('Repeatable section toggle for variable-length data'),

          createHeading('3.2.3 Database Schema', HeadingLevel.HEADING_3),
          createParagraph('Table: pane_section_mappings', true),
          createTable(
            ['Column', 'Type', 'Description'],
            [
              ['id', 'UUID', 'Primary key'],
              ['product_code', 'TEXT', 'Product code'],
              ['event_code', 'TEXT', 'Event code'],
              ['business_application', 'TEXT[]', 'Business applications (array)'],
              ['customer_segment', 'TEXT[]', 'Customer segments (array)'],
              ['panes', 'JSONB', 'Pane and section configuration'],
              ['is_active', 'BOOLEAN', 'Active status'],
              ['user_id', 'UUID', 'Creator user ID'],
              ['created_at', 'TIMESTAMP', 'Creation timestamp'],
              ['updated_at', 'TIMESTAMP', 'Last update timestamp'],
            ]
          ),

          createParagraph('Panes JSONB Structure:', true),
          createTable(
            ['Property', 'Type', 'Description'],
            [
              ['pane_name', 'string', 'Unique pane identifier'],
              ['pane_order', 'number', 'Display order'],
              ['sections', 'array', 'Array of section objects'],
              ['sections[].section_name', 'string', 'Section identifier'],
              ['sections[].section_order', 'number', 'Section display order'],
              ['sections[].rows', 'number', 'Grid rows'],
              ['sections[].columns', 'number', 'Grid columns'],
              ['sections[].isRepeatable', 'boolean', 'Repeatable section flag'],
              ['sections[].groupId', 'string', 'Group ID for repeatable sections'],
            ]
          ),

          createHeading('3.3 Field Definition (Field Repository)', HeadingLevel.HEADING_2),
          createHeading('3.3.1 Purpose', HeadingLevel.HEADING_3),
          createParagraph(
            'Defines individual form fields with their properties, data types, validation rules, and grid coordinates within sections.'
          ),
          createHeading('3.3.2 UI Description', HeadingLevel.HEADING_3),
          createBulletPoint('Cascading selection for Product → Event → Pane → Section'),
          createBulletPoint('Manual field creation form with all field properties'),
          createBulletPoint('Excel bulk upload with preview and validation'),
          createBulletPoint('Clear & Replace option for bulk updates'),
          createBulletPoint('Grid view displaying all configured fields'),

          createHeading('3.3.3 Database Schema', HeadingLevel.HEADING_3),
          createParagraph('Table: field_repository', true),
          createTable(
            ['Column', 'Type', 'Description'],
            [
              ['id', 'UUID', 'Primary key'],
              ['field_id', 'TEXT', 'Unique field identifier'],
              ['field_code', 'TEXT', 'Auto-generated from label (UPPER_SNAKE_CASE)'],
              ['field_label_key', 'TEXT', 'Display label'],
              ['product_code', 'TEXT', 'Product code'],
              ['event_type', 'TEXT', 'Event code'],
              ['pane_code', 'TEXT', 'Parent pane'],
              ['section_code', 'TEXT', 'Parent section'],
              ['data_type', 'TEXT', 'Field data type'],
              ['ui_display_type', 'TEXT', 'UI component type'],
              ['field_row', 'INTEGER', 'Grid row position'],
              ['field_column', 'INTEGER', 'Grid column position'],
              ['is_mandatory_portal', 'BOOLEAN', 'Required for portal'],
              ['is_mandatory_bo', 'BOOLEAN', 'Required for back office'],
              ['dropdown_values', 'TEXT[]', 'Dropdown options'],
              ['default_value', 'TEXT', 'Default field value'],
              ['length_min', 'INTEGER', 'Minimum length'],
              ['length_max', 'INTEGER', 'Maximum length'],
              ['effective_from_date', 'DATE', 'Effective start date'],
              ['effective_to_date', 'DATE', 'Effective end date'],
              ['is_active_flag', 'BOOLEAN', 'Active status'],
              ['user_id', 'UUID', 'Creator user ID'],
            ]
          ),

          createSectionBreak(),

          // 4. NextGen Workflow Configurator
          createHeading('4. NextGen Workflow Configurator', HeadingLevel.HEADING_1),
          createParagraph(
            'The NextGen Workflow Configurator enables administrators to define complete workflow templates that control transaction processing through multiple stages.'
          ),

          createHeading('4.1 Workflow Templates', HeadingLevel.HEADING_2),
          createHeading('4.1.1 Purpose', HeadingLevel.HEADING_3),
          createParagraph(
            'Defines the top-level workflow configuration including product, event, trigger type, and template lifecycle status.'
          ),
          createHeading('4.1.2 UI Description', HeadingLevel.HEADING_3),
          createBulletPoint('Template dashboard with status badges (Draft, Submitted, Active, Inactive)'),
          createBulletPoint('Create/Edit template dialog with module, product, event selection'),
          createBulletPoint('Trigger type configuration (Manual, ClientPortal, Automated)'),
          createBulletPoint('Template lifecycle actions (Submit, Activate, Deactivate)'),
          createBulletPoint('Copy template functionality'),

          createHeading('4.1.3 Database Schema', HeadingLevel.HEADING_3),
          createParagraph('Table: workflow_templates', true),
          createTable(
            ['Column', 'Type', 'Description'],
            [
              ['id', 'UUID', 'Primary key'],
              ['template_name', 'TEXT', 'Unique template name'],
              ['template_description', 'TEXT', 'Template description'],
              ['module_code', 'TEXT', 'Module code (TF, SCF)'],
              ['product_code', 'TEXT', 'Product code'],
              ['event_code', 'TEXT', 'Event code'],
              ['trigger_type', 'TEXT', 'Trigger type (Manual, ClientPortal, Automated)'],
              ['status', 'TEXT', 'Template status (Draft, Submitted, Active, Inactive)'],
              ['version', 'INTEGER', 'Template version'],
              ['is_active', 'BOOLEAN', 'Active flag'],
              ['user_id', 'UUID', 'Creator user ID'],
              ['created_at', 'TIMESTAMP', 'Creation timestamp'],
              ['updated_at', 'TIMESTAMP', 'Last update timestamp'],
            ]
          ),

          createHeading('4.2 Stage Flow Builder', HeadingLevel.HEADING_2),
          createHeading('4.2.1 Purpose', HeadingLevel.HEADING_3),
          createParagraph(
            'Defines the workflow stages for a template, including stage sequence, actor types, SLA, and rejection routing.'
          ),
          createHeading('4.2.2 UI Description', HeadingLevel.HEADING_3),
          createBulletPoint('Visual stage flow canvas with connected stage cards'),
          createBulletPoint('Stage configuration: name, actor type, SLA hours'),
          createBulletPoint('Drag-and-drop stage reordering'),
          createBulletPoint('Rejection routing configuration'),
          createBulletPoint('Stage condition modal for business rules'),

          createHeading('4.2.3 Database Schema', HeadingLevel.HEADING_3),
          createParagraph('Table: workflow_stages', true),
          createTable(
            ['Column', 'Type', 'Description'],
            [
              ['id', 'UUID', 'Primary key'],
              ['template_id', 'UUID', 'Parent template ID (FK)'],
              ['stage_name', 'TEXT', 'Stage name'],
              ['stage_order', 'INTEGER', 'Stage sequence order'],
              ['actor_type', 'TEXT', 'Actor type (Maker, Checker, System)'],
              ['sla_hours', 'INTEGER', 'SLA in hours'],
              ['reject_to_stage', 'TEXT', 'Rejection target stage'],
              ['conditions', 'JSONB', 'Stage entry conditions'],
              ['created_at', 'TIMESTAMP', 'Creation timestamp'],
              ['updated_at', 'TIMESTAMP', 'Last update timestamp'],
            ]
          ),

          createHeading('4.3 Stage Level Field Configuration', HeadingLevel.HEADING_2),
          createHeading('4.3.1 Purpose', HeadingLevel.HEADING_3),
          createParagraph(
            'Maps fields from the Field Repository to specific workflow stages, controlling which fields appear and are editable at each stage.'
          ),
          createHeading('4.3.2 UI Description', HeadingLevel.HEADING_3),
          createBulletPoint('Stage selector dropdown'),
          createBulletPoint('Available Fields panel (collapsible) showing Field Repository fields'),
          createBulletPoint('Configured Fields table with pane, section, field, editable columns'),
          createBulletPoint('Drag-and-drop field assignment'),
          createBulletPoint('Bulk Remove All action'),

          createHeading('4.3.3 Database Schema', HeadingLevel.HEADING_3),
          createParagraph('Table: workflow_stage_fields', true),
          createTable(
            ['Column', 'Type', 'Description'],
            [
              ['id', 'UUID', 'Primary key'],
              ['stage_id', 'UUID', 'Parent stage ID (FK)'],
              ['field_name', 'TEXT', 'Field code from field_repository'],
              ['pane_name', 'TEXT', 'Pane assignment'],
              ['section_name', 'TEXT', 'Section assignment'],
              ['is_visible', 'BOOLEAN', 'Visibility flag'],
              ['is_editable', 'BOOLEAN', 'Editability flag'],
              ['is_mandatory', 'BOOLEAN', 'Mandatory flag'],
              ['field_order', 'INTEGER', 'Display order'],
              ['created_at', 'TIMESTAMP', 'Creation timestamp'],
              ['updated_at', 'TIMESTAMP', 'Last update timestamp'],
            ]
          ),

          createHeading('4.4 Template Level Conditions', HeadingLevel.HEADING_2),
          createHeading('4.4.1 Purpose', HeadingLevel.HEADING_3),
          createParagraph(
            'Defines business logic conditions that control workflow behavior, stage transitions, and validation rules.'
          ),
          createHeading('4.4.2 UI Description', HeadingLevel.HEADING_3),
          createBulletPoint('Condition builder with AND/OR grouping'),
          createBulletPoint('Field selector with operators (equals, greater than, contains, etc.)'),
          createBulletPoint('Natural language condition summary'),
          createBulletPoint('Condition assignment to stages'),

          createHeading('4.4.3 Database Schema', HeadingLevel.HEADING_3),
          createParagraph('Table: workflow_conditions', true),
          createTable(
            ['Column', 'Type', 'Description'],
            [
              ['id', 'UUID', 'Primary key'],
              ['template_id', 'UUID', 'Parent template ID (FK)'],
              ['condition_name', 'TEXT', 'Condition name'],
              ['condition_type', 'TEXT', 'Condition type'],
              ['condition_logic', 'JSONB', 'Condition expression'],
              ['target_stage_id', 'UUID', 'Target stage (FK)'],
              ['action', 'TEXT', 'Action when condition met'],
              ['is_active', 'BOOLEAN', 'Active flag'],
              ['created_at', 'TIMESTAMP', 'Creation timestamp'],
              ['updated_at', 'TIMESTAMP', 'Last update timestamp'],
            ]
          ),

          createSectionBreak(),

          // 5. Runtime Components
          createHeading('5. Runtime Components', HeadingLevel.HEADING_1),

          createHeading('5.1 Dynamic Transaction Form', HeadingLevel.HEADING_2),
          createHeading('5.1.1 Form Rendering Logic', HeadingLevel.HEADING_3),
          createParagraph('The Dynamic Transaction Form renders at runtime by:'),
          createBulletPoint('Finding matching workflow template (Product + Event + Trigger Type)'),
          createBulletPoint('Retrieving template stages ordered by stage_order'),
          createBulletPoint('Fetching stage fields from workflow_stage_fields'),
          createBulletPoint('Building pane-section-field hierarchy'),
          createBulletPoint('Rendering fields using DynamicFieldRenderer based on ui_display_type'),

          createHeading('5.1.2 Stage Navigation', HeadingLevel.HEADING_3),
          createParagraph(
            'Navigation uses pane-based progress indicator ordered by workflow stage configuration:'
          ),
          createBulletPoint('Same pane can appear multiple times if configured in different stages'),
          createBulletPoint('Submit button appears on last pane of each stage'),
          createBulletPoint('Approve & Complete button appears only on final Approval stage'),
          createBulletPoint('Stage-specific completion messages displayed after submission'),

          createHeading('5.1.3 Button Configuration', HeadingLevel.HEADING_3),
          createTable(
            ['Stage', 'Last Pane Button', 'Completion Status'],
            [
              ['Data Entry', 'Submit', 'Submitted / Bank Processing'],
              ['Limit Check', 'Submit', 'Limit Checked'],
              ['Checker Review', 'Submit', 'Checker Reviewed'],
              ['Authorization', 'Submit', 'Sent to Bank'],
              ['Final Approval', 'Approve & Complete', 'Issued'],
            ]
          ),

          createHeading('5.2 Transaction Management', HeadingLevel.HEADING_2),
          createHeading('5.2.1 Transaction Lifecycle', HeadingLevel.HEADING_3),
          createParagraph('Transactions are shared across all users (not user-isolated):'),
          createBulletPoint('All authenticated users see same transaction records'),
          createBulletPoint('Users access transactions based on stage permissions'),
          createBulletPoint('Form data persists in form_data JSONB across stages'),
          createBulletPoint('Repeatable sections preserve all instances across stages'),

          createHeading('5.2.2 Status Progression', HeadingLevel.HEADING_3),
          createTable(
            ['Status', 'Description', 'Next Action'],
            [
              ['Draft', 'Saved but not submitted', 'Continue editing'],
              ['Submitted', 'Portal/Bank data entry complete', 'Limit Check'],
              ['Bank Processing', 'Bank data entry complete', 'Limit Check'],
              ['Limit Checked', 'Limit verification complete', 'Checker Review'],
              ['Checker Reviewed', 'Checker verification complete', 'Final Approval'],
              ['Sent to Bank', 'Portal authorization complete', 'Bank Data Entry'],
              ['Issued', 'Final approval complete', 'Transaction complete'],
              ['Rejected', 'Rejected at any stage', 'Return to Data Entry'],
            ]
          ),

          createHeading('5.2.3 Cross-Workflow Handoff', HeadingLevel.HEADING_3),
          createParagraph(
            'Import LC supports Portal-to-Bank workflow handoff where single transaction progresses through both workflows:'
          ),
          createBulletPoint('Portal Workflow: Data Entry → Authorization'),
          createBulletPoint('After Portal Authorization: Status = "Sent to Bank"'),
          createBulletPoint('Bank Workflow: Data Entry → Limit Check → Checker Review → Final Approval'),
          createBulletPoint('System determines workflow by checking initiating_channel and status'),
          createBulletPoint('Same transaction_ref persists throughout entire workflow'),

          createSectionBreak(),

          // 6. Database Schema Reference
          createHeading('6. Database Schema Reference', HeadingLevel.HEADING_1),

          createHeading('6.1 Transaction Tables', HeadingLevel.HEADING_2),
          createParagraph('Table: transactions', true),
          createTable(
            ['Column', 'Type', 'Description'],
            [
              ['id', 'UUID', 'Primary key'],
              ['transaction_ref', 'TEXT', 'Unique reference (ProductCode-EventCode-LCNumber)'],
              ['product_code', 'TEXT', 'Product code'],
              ['event_code', 'TEXT', 'Event code'],
              ['status', 'TEXT', 'Current transaction status'],
              ['initiating_channel', 'TEXT', 'Originating channel (Portal, Bank)'],
              ['form_data', 'JSONB', 'Complete form data across all stages'],
              ['current_stage', 'TEXT', 'Current workflow stage'],
              ['user_id', 'UUID', 'Creator user ID'],
              ['created_at', 'TIMESTAMP', 'Creation timestamp'],
              ['updated_at', 'TIMESTAMP', 'Last update timestamp'],
            ]
          ),

          createHeading('6.2 User Permission Tables', HeadingLevel.HEADING_2),
          createParagraph('Table: user_permissions', true),
          createTable(
            ['Column', 'Type', 'Description'],
            [
              ['id', 'UUID', 'Primary key'],
              ['user_id', 'UUID', 'User ID (FK to custom_users)'],
              ['module_code', 'TEXT', 'Module code (TF, SCF)'],
              ['product_code', 'TEXT', 'Product code'],
              ['event_code', 'TEXT', 'Event code'],
              ['stage_name', 'TEXT', 'Stage name or __ALL__'],
              ['can_make', 'BOOLEAN', 'Maker permission'],
              ['can_view', 'BOOLEAN', 'Viewer permission'],
              ['can_check', 'BOOLEAN', 'Checker permission'],
            ]
          ),

          createParagraph('Table: custom_users', true),
          createTable(
            ['Column', 'Type', 'Description'],
            [
              ['id', 'UUID', 'Primary key'],
              ['user_id', 'UUID', 'Auth user ID'],
              ['user_login_id', 'TEXT', 'Login identifier'],
              ['full_name', 'TEXT', 'Display name'],
              ['password_hash', 'TEXT', 'Hashed password'],
              ['business_applications', 'TEXT[]', 'Assigned business applications'],
              ['is_super_user', 'BOOLEAN', 'Super user flag'],
              ['corporate_id', 'TEXT', 'Corporate identifier'],
            ]
          ),

          createSectionBreak(),

          // 7. API/RPC Functions
          createHeading('7. API/RPC Functions', HeadingLevel.HEADING_1),
          createParagraph(
            'Security definer functions bypass RLS policies for custom authentication while maintaining data isolation.'
          ),

          createHeading('7.1 Pane Section Functions', HeadingLevel.HEADING_2),
          createTable(
            ['Function', 'Parameters', 'Description'],
            [
              ['get_pane_section_mappings', 'p_product_code, p_event_code', 'Retrieves pane/section configurations'],
              ['upsert_pane_section_mapping', 'p_user_id, p_product_code, p_event_code, p_panes, ...', 'Creates or updates configuration'],
              ['toggle_pane_section_active', 'p_id, p_is_active', 'Activates/deactivates configuration'],
            ]
          ),

          createHeading('7.2 Field Repository Functions', HeadingLevel.HEADING_2),
          createTable(
            ['Function', 'Parameters', 'Description'],
            [
              ['get_fields_for_workflow', 'p_product_code, p_event_type', 'Retrieves fields for workflow configuration'],
              ['upsert_field_repository', 'p_user_id, p_fields (JSONB array)', 'Bulk upsert fields'],
              ['delete_fields_by_product_event', 'p_product_code, p_event_type', 'Bulk delete for replacement'],
              ['update_field_repository', 'p_field_id, p_updates', 'Update single field'],
            ]
          ),

          createHeading('7.3 User Permission Functions', HeadingLevel.HEADING_2),
          createTable(
            ['Function', 'Parameters', 'Description'],
            [
              ['upsert_user_permission', 'p_user_id, p_module_code, p_product_code, ...', 'Creates or updates permission'],
              ['delete_user_permissions', 'p_user_id', 'Deletes all permissions for user'],
              ['update_super_user_status', 'p_user_id, p_is_super_user', 'Updates super user flag'],
              ['get_user_stage_permissions', 'p_user_id', 'Retrieves all stage permissions'],
            ]
          ),

          createSectionBreak(),

          // 8. Security & Access Control
          createHeading('8. Security & Access Control', HeadingLevel.HEADING_1),

          createHeading('8.1 Business Application Context', HeadingLevel.HEADING_2),
          createParagraph('Access is determined by the combination of User ID and Business Application:'),
          createBulletPoint('Adria TSCF Client → Portal workflows (ClientPortal trigger)'),
          createBulletPoint('Adria Process Orchestrator → Bank workflows (Manual trigger)'),
          createBulletPoint('Adria TSCF Bank → Bank workflows (Manual trigger)'),
          createBulletPoint('Control Centre visible only to Orchestrator and Bank business centres'),

          createHeading('8.2 Stage-Level Permissions', HeadingLevel.HEADING_2),
          createParagraph('Users see only panes/fields for stages they have permission to access:'),
          createBulletPoint('Maker permission → Data Entry stage access'),
          createBulletPoint('Checker permission → Approval/Authorization stage access'),
          createBulletPoint('Stage alias system treats equivalent stage names interchangeably'),
          createBulletPoint('Super users bypass all permission checks'),

          createHeading('8.3 Stage Aliases', HeadingLevel.HEADING_2),
          createTable(
            ['Alias Group', 'Stage Names'],
            [
              ['Approval Stages', 'Authorization, Approval, Final Approval, Checker Review, Verification'],
              ['Entry Stages', 'Data Entry, Entry, Input'],
              ['Check Stages', 'Limit Check, Verification, Review'],
            ]
          ),

          createSectionBreak(),

          // 9. Appendix
          createHeading('9. Appendix', HeadingLevel.HEADING_1),

          createHeading('9.1 Key Type Definitions', HeadingLevel.HEADING_2),
          createParagraph('WorkflowTemplateRuntime:', true),
          createBulletPoint('id, template_name, template_description'),
          createBulletPoint('module_code, product_code, event_code'),
          createBulletPoint('trigger_type, status, version, is_active'),

          createParagraph('WorkflowStageRuntime:', true),
          createBulletPoint('id, template_id, stage_name, stage_order'),
          createBulletPoint('actor_type, sla_hours, reject_to_stage, conditions'),

          createParagraph('WorkflowStageFieldRuntime:', true),
          createBulletPoint('id, stage_id, field_name, pane_name, section_name'),
          createBulletPoint('is_visible, is_editable, is_mandatory, field_order'),

          createHeading('9.2 Status Mappings', HeadingLevel.HEADING_2),
          createTable(
            ['Stage Completed', 'Portal Status', 'Bank Status'],
            [
              ['Data Entry', 'Submitted', 'Bank Processing'],
              ['Limit Check', 'Limit Checked', 'Limit Checked'],
              ['Authorization', 'Sent to Bank', '-'],
              ['Checker Review', '-', 'Checker Reviewed'],
              ['Final Approval', '-', 'Issued'],
            ]
          ),

          createHeading('9.3 Trigger Type Mappings', HeadingLevel.HEADING_2),
          createTable(
            ['Business Application', 'Trigger Type'],
            [
              ['Adria TSCF Client', 'ClientPortal'],
              ['Adria Process Orchestrator', 'Manual'],
              ['Adria TSCF Bank', 'Manual'],
            ]
          ),

          // End of document
          new Paragraph({ spacing: { before: 800 } }),
          new Paragraph({
            children: [
              new TextRun({
                text: '--- End of Document ---',
                italics: true,
                color: '666666',
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'Dynamic_Form_Engine_NextGen_Workflow_Specification.docx');
};
