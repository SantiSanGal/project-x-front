import { DialogTitle } from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"

interface ModalProps {
    openModal: boolean
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const Modal = ({ openModal, setOpenModal }: ModalProps) => {
    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Customize Your Pixels: Colors & Positions</DialogTitle>
                </DialogHeader>
                <div className="flex items-center w-full justify-center">
                    <div className="grid grid-cols-5 w-fit gap-0 place-content-center p-0">
                        {Array.from({ length: 25 }).map((_, index) => (
                            <button key={index} className={cn("h-10 w-10 border hover:border-slate-400")}></button>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
