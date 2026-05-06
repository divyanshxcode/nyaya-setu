import type { GeneratedActionPlan, ExtractedCaseDetail } from '@/types';

/**
 * Generate HTML representation of action plan for PDF export
 */
export function generateActionPlanHTML(actionPlan: GeneratedActionPlan, caseDetails?: ExtractedCaseDetail): string {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const priorityStyle = (priority: string) => {
    const colors: Record<string, string> = {
      critical: '#dc2626',
      high: '#f97316',
      medium: '#eab308',
      low: '#16a34a',
    };
    return `color: white; background-color: ${colors[priority] || '#6b7280'}; padding: 4px 8px; border-radius: 4px; display: inline-block; font-weight: bold;`;
  };

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Legal Action Plan</title>
      <style>
        * { margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 900px; margin: 0 auto; padding: 40px; }
        h1 { color: #1e293b; margin-bottom: 10px; font-size: 28px; border-bottom: 3px solid #001f3f; padding-bottom: 10px; }
        h2 { color: #003366; margin-top: 30px; margin-bottom: 15px; font-size: 20px; border-left: 4px solid #ffd700; padding-left: 10px; }
        h3 { color: #334155; margin-top: 15px; margin-bottom: 10px; font-size: 16px; }
        .header-info { background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .header-info p { margin: 5px 0; }
        .section { margin-bottom: 25px; }
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
        .stat-card { background: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 6px; text-align: center; }
        .stat-value { font-size: 24px; font-weight: bold; color: #1e293b; }
        .stat-label { font-size: 12px; color: #64748b; margin-top: 5px; }
        .executive-summary { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
        .requirement-item { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; margin-bottom: 10px; border-radius: 4px; }
        .requirement-title { font-weight: bold; color: #1e293b; }
        .requirement-detail { margin-left: 15px; margin-top: 5px; font-size: 13px; color: #475569; }
        .priority-badge { ${priorityStyle('high')} }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 13px; }
        th { background: #1e293b; color: white; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
        tr:nth-child(even) { background: #f8fafc; }
        ul, ol { margin-left: 20px; margin-bottom: 10px; }
        li { margin-bottom: 5px; }
        .page-break { page-break-before: always; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        @media print {
          body { margin: 0; padding: 0; }
          .container { padding: 20px; }
          .page-break { page-break-before: always; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📋 Legal Action Plan</h1>
        <p style="color: #64748b; margin-bottom: 20px;">Generated on ${formatDate(actionPlan.generatedAt)}</p>
  `;

  // Executive Summary
  if (actionPlan.executiveSummary) {
    html += `
      <div class="executive-summary">
        <h3>Executive Summary</h3>
        <p>${actionPlan.executiveSummary}</p>
      </div>
    `;
  }

  // Stats
  const stats = {
    'Total Actions': actionPlan.actionItems.length,
    'Critical': actionPlan.actionItems.filter(a => a.priority === 'critical').length,
    'High Priority': actionPlan.actionItems.filter(a => a.priority === 'high').length,
  };

  if (Object.values(stats).some(v => v > 0)) {
    html += `
      <div class="stat-grid">
        ${Object.entries(stats)
          .map(
            ([label, value]) => `
          <div class="stat-card">
            <div class="stat-value">${value}</div>
            <div class="stat-label">${label}</div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  // Compliance Requirements
  if (actionPlan.complianceRequirements.length > 0) {
    html += `
      <h2>Compliance Requirements</h2>
      <table>
        <tr>
          <th>Description</th>
          <th>Priority</th>
          <th>Department</th>
          <th>Deadline</th>
        </tr>
        ${actionPlan.complianceRequirements
          .map(
            req => `
          <tr>
            <td><strong>${req.description}</strong><br><small style="color: #64748b;">${req.legalBasis}</small></td>
            <td><span style="${priorityStyle(req.priority)}">${req.priority}</span></td>
            <td>${req.responsibleDepartment}</td>
            <td>${req.deadline ? formatDate(req.deadline) : '—'}</td>
          </tr>
        `
          )
          .join('')}
      </table>
    `;
  }

  // Appeal Considerations
  if (actionPlan.appealConsiderations) {
    html += `
      <h2>Appeal Considerations</h2>
      <div class="section">
        <h3>Grounds for Appeal</h3>
        <ul>
          ${actionPlan.appealConsiderations.groundsForAppeal.map(g => `<li>${g}</li>`).join('')}
        </ul>
        
        <h3>Likelihood of Success</h3>
        <p><strong>${actionPlan.appealConsiderations.likelihoodOfSuccess}</strong></p>
        <p>${actionPlan.appealConsiderations.reasoning}</p>
        
        ${actionPlan.appealConsiderations.deadlineForFiling ? `<p><strong>Filing Deadline:</strong> ${formatDate(actionPlan.appealConsiderations.deadlineForFiling)}</p>` : ''}
      </div>
    `;
  }

  // Key Timelines
  if (actionPlan.keyTimelines.length > 0) {
    html += `
      <h2>Key Timelines</h2>
      <table>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Type</th>
        </tr>
        ${actionPlan.keyTimelines
          .map(
            timeline => `
          <tr>
            <td><strong>${formatDate(timeline.date)}</strong></td>
            <td>${timeline.description}</td>
            <td>${timeline.isExplicit ? 'Explicit' : 'Inferred'} (${timeline.type})</td>
          </tr>
        `
          )
          .join('')}
      </table>
    `;
  }

  // Risk Assessment
  if (actionPlan.riskAssessment) {
    html += `
      <h2>Risk Assessment</h2>
      <div class="section">
        ${actionPlan.riskAssessment.nonComplianceRisks.length > 0 ? `
          <h3>Non-Compliance Risks</h3>
          <ul>
            ${actionPlan.riskAssessment.nonComplianceRisks.map(r => `<li>${r}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${actionPlan.riskAssessment.financialExposure ? `
          <h3>Financial Exposure</h3>
          <p>${actionPlan.riskAssessment.financialExposure}</p>
        ` : ''}
        
        ${actionPlan.riskAssessment.reputationalRisk ? `
          <h3>Reputational Risk</h3>
          <p>${actionPlan.riskAssessment.reputationalRisk}</p>
        ` : ''}
        
        ${actionPlan.riskAssessment.escalationRisks.length > 0 ? `
          <h3>Escalation Risks</h3>
          <ul>
            ${actionPlan.riskAssessment.escalationRisks.map(r => `<li>${r}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `;
  }

  // Documentation Requirements
  if (actionPlan.recommendedDocumentation.length > 0) {
    html += `
      <h2>Recommended Documentation</h2>
      <table>
        <tr>
          <th>Document Type</th>
          <th>Purpose</th>
          <th>Priority</th>
          <th>Deadline</th>
        </tr>
        ${actionPlan.recommendedDocumentation
          .map(
            doc => `
          <tr>
            <td><strong>${doc.documentType}</strong></td>
            <td>${doc.purpose}</td>
            <td><span style="${priorityStyle(doc.priority)}">${doc.priority}</span></td>
            <td>${doc.deadline ? formatDate(doc.deadline) : '—'}</td>
          </tr>
        `
          )
          .join('')}
      </table>
    `;
  }

  // External Counsel Instructions
  if (actionPlan.externalCounselInstructions.length > 0) {
    html += `
      <h2>External Counsel Instructions</h2>
      ${actionPlan.externalCounselInstructions
        .map(
          instr => `
        <div class="requirement-item">
          <div class="requirement-title">${instr.priority}</div>
          <div class="requirement-detail">${instr.instruction}</div>
          ${instr.deadline ? `<div class="requirement-detail"><strong>Deadline:</strong> ${formatDate(instr.deadline)}</div>` : ''}
        </div>
      `
        )
        .join('')}
    `;
  }

  // Action Items
  if (actionPlan.actionItems.length > 0) {
    html += `
      <h2>Action Items</h2>
      <table>
        <tr>
          <th>Title</th>
          <th>Priority</th>
          <th>Responsible Party</th>
          <th>Deadline</th>
          <th>Status</th>
        </tr>
        ${actionPlan.actionItems
          .map(
            action => `
          <tr>
            <td><strong>${action.title}</strong><br><small>${action.description}</small></td>
            <td><span style="${priorityStyle(action.priority)}">${action.priority}</span></td>
            <td>${action.responsibleParty}</td>
            <td>${action.deadline ? formatDate(action.deadline) : '—'}</td>
            <td>${action.status}</td>
          </tr>
        `
          )
          .join('')}
      </table>
    `;
  }

  // Footer
  html += `
        <div class="footer">
          <p>This document was automatically generated by the Legal Case Management System.</p>
          <p>For official records, please keep a copy of this report.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Export action plan as PDF using browser print functionality
 */
export function exportToPDF(html: string, filename: string = 'action-plan.pdf') {
  const printWindow = window.open('', '', 'height=800,width=1000');
  if (!printWindow) {
    alert('Please allow popups to export PDF');
    return;
  }

  printWindow.document.write(html);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
    // Note: Close after a delay to allow user to see the print dialog
    // The window will be closed automatically after printing
  }, 250);
}

/**
 * Export as formatted text
 */
export function exportToText(actionPlan: GeneratedActionPlan): string {
  let text = '='.repeat(80) + '\n';
  text += 'LEGAL ACTION PLAN\n';
  text += '='.repeat(80) + '\n\n';

  text += `Generated: ${new Date(actionPlan.generatedAt).toLocaleString()}\n\n`;

  text += 'EXECUTIVE SUMMARY\n';
  text += '-'.repeat(40) + '\n';
  text += actionPlan.executiveSummary + '\n\n';

  text += 'COMPLIANCE REQUIREMENTS\n';
  text += '-'.repeat(40) + '\n';
  actionPlan.complianceRequirements.forEach((req, idx) => {
    text += `\n${idx + 1}. ${req.description}\n`;
    text += `   Legal Basis: ${req.legalBasis}\n`;
    text += `   Priority: ${req.priority}\n`;
    text += `   Department: ${req.responsibleDepartment}\n`;
    if (req.deadline) {
      text += `   Deadline: ${new Date(req.deadline).toLocaleDateString()}\n`;
    }
  });

  text += '\n\nKEY TIMELINES\n';
  text += '-'.repeat(40) + '\n';
  actionPlan.keyTimelines.forEach(timeline => {
    text += `${new Date(timeline.date).toLocaleDateString()}: ${timeline.description}\n`;
  });

  text += '\n\nRISK ASSESSMENT\n';
  text += '-'.repeat(40) + '\n';
  if (actionPlan.riskAssessment) {
    text += 'Non-Compliance Risks:\n';
    actionPlan.riskAssessment.nonComplianceRisks.forEach(risk => {
      text += `  • ${risk}\n`;
    });
    if (actionPlan.riskAssessment.financialExposure) {
      text += `\nFinancial Exposure: ${actionPlan.riskAssessment.financialExposure}\n`;
    }
    text += `\nReputational Risk: ${actionPlan.riskAssessment.reputationalRisk}\n`;
  }

  text += '\n\nACTION ITEMS\n';
  text += '-'.repeat(40) + '\n';
  actionPlan.actionItems.forEach((action, idx) => {
    text += `\n${idx + 1}. ${action.title}\n`;
    text += `   Description: ${action.description}\n`;
    text += `   Priority: ${action.priority}\n`;
    text += `   Responsible: ${action.responsibleParty}\n`;
    text += `   Status: ${action.status}\n`;
    if (action.deadline) {
      text += `   Deadline: ${new Date(action.deadline).toLocaleDateString()}\n`;
    }
  });

  return text;
}
