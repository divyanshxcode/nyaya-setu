'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useExtraction } from '@/lib/extraction-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AlertCircle, Check, Pause, X, Edit2 } from 'lucide-react';
import type { ExtractedCaseDetail } from '@/types';

// Dynamically import PDF viewer with ssr: false.
const PDFViewerComponent = dynamic(() => import('./PDFViewer'), {
  ssr: false,
  loading: () => (
    <Card>
      <CardContent className="flex h-[600px] items-center justify-center pt-6 text-muted-foreground">
        Loading PDF viewer...
      </CardContent>
    </Card>
  ),
});

// Organize fields by sections
const fieldSections = {
  'Case Identification': ['caseNumber', 'court', 'jurisdiction'],
  'Order Details': ['dateOfOrder', 'judge', 'natureOfCase'],
  'Parties': ['plaintiff', 'defendant', 'partiesInvolved'],
  'Case Information': ['caseDetails', 'keyDirectionsOrOrders', 'relevantTimelines'],
  'Legal & Consequences': ['legalSections', 'penaltiesOrConsequences', 'nextHearingDate', 'additionalRemarks'],
} as Record<string, (keyof ExtractedCaseDetail)[]>;

function getConfidenceBadgeColor(score: number): string {
  if (score >= 85) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (score >= 60) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-red-50 text-red-700 border-red-200';
}

export function ExtractionStep2() {
  const {
    extraction,
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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)]">
      {/* LEFT PANEL: Table Structure */}
      <div className="space-y-4">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle>Extracted Case Details</CardTitle>
            <CardDescription>Review and edit if necessary</CardDescription>
            <div className="grid gap-3 border-t pt-4">
              <Textarea
                placeholder="Reviewer notes or context..."
                value={reviewerNotes}
                onChange={e => setReviewerNotes(e.target.value)}
                className="min-h-[72px] resize-none bg-slate-50"
              />
              <div className="flex flex-wrap gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Approve extraction?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will proceed to action plan generation using the reviewed details.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-3">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleApprove} className="bg-primary">
                        Approve & Continue
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>

                <Button variant="outline" className="bg-slate-50 text-slate-700">
                  <Pause className="mr-2 h-4 w-4" />
                  Hold
                </Button>

                <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" disabled>
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="max-h-[720px] space-y-5 overflow-y-auto pt-0">
            {Object.entries(fieldSections).map(([sectionName, fieldKeys]) => (
              <div key={sectionName}>
                <h3 className="mb-2 border-b pb-2 text-sm font-semibold text-foreground">{sectionName}</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {fieldKeys.map(fieldKey => {
                      const field = extraction.extractedFieldsWithMeta.find(f => f.fieldKey === fieldKey);
                      if (!field) return null;

                      const isEditing = editingField === fieldKey;
                      const displayValue = field.editedValue || field.value;
                      const isEdited = field.isEdited || false;

                      return (
                        <tr key={fieldKey} className="border-b border-slate-100 hover:bg-slate-50/80">
                          <td className="w-[32%] px-2 py-2.5 align-top text-sm font-medium text-foreground">
                            {field.fieldLabel}
                          </td>
                          <td className="w-[68%] px-2 py-2.5 text-foreground">
                            {isEditing ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editValue}
                                  onChange={e => setEditValue(e.target.value)}
                                  className="min-h-[60px] w-full rounded border p-2 text-sm"
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={saveEdit} className="bg-primary">
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
                                  <p className={isEdited ? 'font-medium text-foreground' : 'text-foreground'}>
                                    {displayValue}
                                  </p>
                                  {field.sourceText && (
                                    <p className="mt-1 text-xs italic text-muted-foreground">
                                      {field.sourceText.substring(0, 100)}...
                                    </p>
                                  )}
                                  <div className="mt-2 flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className={`border text-xs ${getConfidenceBadgeColor(field.confidenceScore)}`}
                                    >
                                      {field.confidenceScore}%
                                    </Badge>
                                    {isEdited && (
                                      <Badge variant="outline" className="border-slate-200 bg-slate-100 text-xs text-slate-700">
                                        Edited
                                      </Badge>
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
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>PDF Preview</CardTitle>
            <CardDescription>Source document</CardDescription>
          </CardHeader>
          <CardContent>
            {extraction.pdfFile && (
              <PDFViewerComponent file={extraction.pdfFile} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
