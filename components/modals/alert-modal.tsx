"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}
export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, onConfirm, loading }) => {
    const [isMounted, setIsMounted] = useState(false);  
    useEffect(() => {
        setIsMounted(true);
        
    }, []);
    if (!isMounted) {
        return null;
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Are you sure?" description="This action cannot be undone.">
            <div className="pt-6 flex justify-end space-x-2 w-full">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button variant="destructive" onClick={onConfirm} disabled={loading}>Continue</Button>
            </div>
        </Modal>
    );
}