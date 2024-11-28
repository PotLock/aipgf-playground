import { useState } from 'react'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CreateActionModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateAction: (action: { title: string; label: string; action: string }) => void
}

export default function CreateActionModal({ isOpen, onClose, onCreateAction }: CreateActionModalProps) {
  const [title, setTitle] = useState('')
  const [label, setLabel] = useState('')
  const [action, setAction] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateAction({ title, label, action })
    setTitle('')
    setLabel('')
    setAction('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create Suggested Action</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Textarea
                id="action"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Action</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

