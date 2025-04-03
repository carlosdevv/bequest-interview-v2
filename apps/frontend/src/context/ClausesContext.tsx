import React, { createContext, useContext, useEffect, useState } from 'react';
import clausesData from '../data/clauses.json';

export interface Clause {
  id: string;
  title: string;
  content: string;
  uniqueId?: string;
}

interface ClausesContextType {
  availableClauses: Clause[];
  selectedClauses: Clause[];
  addClause: (clause: Clause) => void;
  removeClause: (index: number) => void;
  isAddClauseDialogOpen: boolean;
  setAddClauseDialogOpen: (isOpen: boolean) => void;
  insertPosition: number;
  setInsertPosition: (position: number) => void;
  setSelectedClauses: (clauses: Clause[]) => void;
  addClauseToDocument: (clause: Clause) => void;
}

const ClausesContext = createContext<ClausesContextType | undefined>(undefined);

export const ClausesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [availableClauses, setAvailableClauses] = useState<Clause[]>([]);
  const [selectedClauses, setSelectedClauses] = useState<Clause[]>([]);
  const [isAddClauseDialogOpen, setAddClauseDialogOpen] = useState(false);
  const [insertPosition, setInsertPosition] = useState(0);

  useEffect(() => {
    setAvailableClauses(clausesData);
  }, []);

  const addClause = (clause: Clause) => {
    const combinedId = `${clause.id}-${insertPosition}`;

    const clauseWithCombinedId = {
      ...clause,
      uniqueId: combinedId
    };

    setSelectedClauses((prev) => {
      const newClauses = [...prev];
      newClauses.splice(insertPosition, 0, clauseWithCombinedId);
      return newClauses;
    });
  };

  const addClauseToDocument = (clause: Clause) => {
    return clause;
  };

  const removeClause = (index: number) => {
    const newClauses = [...selectedClauses];
    newClauses.splice(index, 1);
    setSelectedClauses(newClauses);
  };

  return (
    <ClausesContext.Provider
      value={{
        availableClauses,
        selectedClauses,
        addClause,
        removeClause,
        isAddClauseDialogOpen,
        setAddClauseDialogOpen,
        insertPosition,
        setInsertPosition,
        setSelectedClauses,
        addClauseToDocument,
      }}
    >
      {children}
    </ClausesContext.Provider>
  );
};

export const useClauses = () => {
  const context = useContext(ClausesContext);
  if (context === undefined) {
    throw new Error('useClauses must be used within a ClausesProvider');
  }
  return context;
};
