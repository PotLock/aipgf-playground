"use client"

import { PlusCircle, Trash2, X } from 'lucide-react'
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SuggestedActions {
    id: number
    label: string
    action: string
    title: string
}

export default function Component() {
    const [actions, setActions] = useState<SuggestedActions[]>([])
    const [newAction, setNewAction] = useState<Omit<SuggestedActions, "id">>({ label: "", action: "", title: "" })

    const addAction = () => {
        if (newAction.label && newAction.action && newAction.title) {
            setActions([...actions, { ...newAction, id: Date.now() }])
            setNewAction({ label: "", action: "", title: "" })
        }
    }

    const removeAction = (id: number) => {
        setActions(actions.filter(item => item.id !== id))
    }

    const deleteAllActions = () => {
        setActions([])
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Suggested Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); addAction(); }} className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="label">Label</Label>
                            <Input
                                id="label"
                                value={newAction.label}
                                onChange={(e) => setNewAction({ ...newAction, label: e.target.value })}
                                placeholder="Enter label"
                            />
                        </div>
                        <div>
                            <Label htmlFor="action">Action</Label>
                            <Input
                                id="action"
                                value={newAction.action}
                                onChange={(e) => setNewAction({ ...newAction, action: e.target.value })}
                                placeholder="Enter action"
                            />
                        </div>
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={newAction.title}
                                onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                                placeholder="Enter title"
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full">
                        <PlusCircle className="mr-2 size-4" /> Add Item
                    </Button>
                </form>
                <div className="mt-6 space-y-2">
                    {actions.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                            <div className="grow mr-2">
                                <span className="font-semibold">{item.label}</span> -
                                <span className="text-muted-foreground"> {item.action}</span> -
                                <span className="italic">{item.title}</span>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeAction(item.id)}
                                aria-label={`Remove ${item.label}`}
                            >
                                <X className="size-4" />
                                <span className="sr-only">Remove</span>
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="destructive" onClick={deleteAllActions} className="w-full">
                    <Trash2 className="mr-2 size-4" /> Delete All Actions
                </Button>
            </CardFooter>
        </Card>
    )
}