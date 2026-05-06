'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useExtraction } from '@/lib/extraction-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AlertCircle, Check, X, Edit2 } from 'lucide-react';
import type { ExtractedCaseDetail } from '@/types';

// Dynamically import PDF viewer with ssr: false
const PDFViewer = dynamic(
  () => import('./PDFViewer').then(mod => ({ default: mod.PDFViewer })),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="pt-6 h-[600px] flex items-center justify-center text-muted-foreground">
          Loading PDF viewer...
        </CardContent>
      </Card>
    ),
  }
);

const fieldLabels: Record<keyof ExtractedCaseDetail, string> = {
  caseNumber: 'Case Number',
  court: 'Court',
  judge: 'Judge',
  jurisdiction: 'Jurisdiction',
  dateOfOrder: 'Date of Order',
  defendant: 'Defendant',
  plaintiff: 'Plaintiff',
  natureOfCase: 'Nature of Case',
  caseDetails: 'Case Details',
  keyDirectionsOrOrders: 'Key Directions / Orders',
  partiesInvolved: 'Parties Involved',
  relevantTimelines: 'Relevant Timelines',
  nextHearingDate: 'Next Hearing Date',
  penaltiesOrConsequences: 'Penalties / Consequences',
  legalSections: 'Legal Sections Cited',
  additionalRemarks: 'Additional Remarks',
};

// Organize fields by sections
const fieldSections = {
  'Case Identification': ['caseNumber', 'court', 'jurisdiction'],
  'Order Details': ['dateOfOrder', 'judge', 'natureOfCase'],
  'Parties': ['plaintiff', 'defendant', 'partiesInvolved'],
  'Case Information': ['caseDetails', 'keyDirectionsOrOrders', 'relevantTimelines'],
  'Legal & Consequences': ['legalSections', 'penaltiesOrConsequences', 'nextHearingDate', 'additionalRemarks'],
} as Record<string, (keyof ExtractedCaseDetail)[]>;

function getConfidenceBadgeColor(score: number): string {
  if (score >= 85) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

export function ExtractionStep2() {
  const {
    extraction,
    isLoading,
    error,
    updateFieldValue,
    approveExtraction,
    nextStep,
  } = useExtraction();

  const [reviewerNotes, setReviewerNotes] = useState('');
  const [editingField, setEditingField] = useState<keyof ExtractedCaseDetail | null>(null);
  const [editValue, setEditValue] = useState('');

  if (!extraction) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p>No extraction data available. Please upload a PDF first.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleApprove = async () => {
    await approveExtraction(reviewerNotes);
    await nextStep();
  };

  const handleEditField = (fieldKey: keyof ExtractedCaseDetail) => {
    const field = extraction.extractedFieldsWithMeta.find(f => f.fieldKey === fieldKey);
    if (field) {
      setEditingField(fieldKey);
      setEditValue(field.editedValue || field.value);
    }
  };

  const saveEdit = () => {
    if (editingField) {
      updateFieldValue(editingField, editValue);
      setEditingField(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT PANEL: Table Structure */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Extracted Case Details</CardTitle>
            <CardDescription>Review and edit if necessary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 max-h-[700px] overflow-y-auto">
            {Object.entries(fieldSections).map(([sectionName, fieldKeys]) => (
              <div key={sectionName}>
                <h3 className="font-semibold text-sm text-navy mb-3 pb-2 border-b">{sectionName}</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {fieldKeys.map(fieldKey => {
                      const field = extraction.extractedFieldsWithMeta.find(f => f.fieldKey === fieldKey);
                      if (!field) return null;

                      const isEditing = editingField === fieldKey;
                      const displayValue = field.editedValue || field.value;
                      const isEdited = field.isEdited || false;

                      return (
                        <tr key={fieldKey} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-3 font-medium text-foreground w-[35%] align-top">
                            {field.fieldLabel}
                          </td>
                          <td className="py-3 px-3 text-foreground w-[65%]">
                            {isEditing ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editValue}
                                  onChange={e => setEditValue(e.target.value)}
                                  className="w-full p-2 border rounded text-sm min-h-[60px]"
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={saveEdit} className="bg-green-600">
                                    Save
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className={isEdited ? 'font-medium text-blue-900' : 'text-foreground'}>
                                    {displayValue}
                                  </p>
                                  {field.sourceText && (
                                    <p className="text-xs text-muted-foreground mt-1 italic">
                                      {field.sourceText.substring(0, 100)}...
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${getConfidenceBadgeColor(field.confidenceScore)}`}
                                    >
                                      {field.confidenceScore}%
                                    </Badge>
                                    {isEdited && (
                                      <Badge className="bg-blue-100 text-blue-800 text-xs">Edited</Badge>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditField(fieldKey)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT PANEL: PDF Viewer */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>PDF Preview</CardTitle>
            <CardDescription>Source document</CardDescription>
          </CardHeader>
          <CardContent>
            {extraction.pdfFile && (
              <PDFViewer file={extraction.pdfFile} />
            )}
          </CardContent>
        </Card>

        {/* REVIEW ACTIONS: Below PDF */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Review Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reviewer Notes (optional)</label>
              <Textarea
                placeholder="Add any notes about the extraction..."
                value={reviewerNotes}
                onChange={e => setReviewerNotes(e.target.value)}
                className="mt-2 min-h-[80px]"
              />
            </div>

            <div className="flex gap-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Approve Extraction?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will proceed to action plan generation. Make sure all details are accurate.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex gap-3">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleApprove} className="bg-green-600">
                      Approve & Continue
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>

              <Button variant="outline" className="flex-1" disabled>
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
