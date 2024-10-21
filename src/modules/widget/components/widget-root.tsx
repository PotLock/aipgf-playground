'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { ComponentBaseProps } from '@/common/interfaces';
import { Button } from '@/components/ui/button';
import { ViewFrame } from '@/modules/chat/validation/ViewFarm';
import MultiSelectTools from '@/components/common/multi-select';
import AugmentedPopup from '@/modules/augmented/components/augmented-popup';
import FormTextField from '@/modules/form/components/form-text-field';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

type WidgetRootProps = ComponentBaseProps;

const WidgetRoot: FC<any> = ({ className, accountAddress }) => {

  const { account } = useWallet();
  const { toast } = useToast();
  const [isOpenCreateWidget, setIsOpenCreateWidget] = useState<boolean>(false);
  const [widgetPrompt, setWidgetPrompt] = useState<string>('');
  const [widgetCode, setWidgetCode] = useState<string>('');
  const [selectedWidgetTools, setSelectedWidgetTools] = useState<string[]>([]);
  const [widgets, setWidgets] = useState<any[]>([]);
  const [previewWidgetCode, setPreviewWidgetCode] = useState<string>('');
  const [tools, setTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTools = useCallback(async () => {
    try {
      const userId = accountAddress
      const response = await axios.get(`/api/tools?userId=${userId}`);
      const contractTools = response.data.filter((tool: any) => tool.type === 'contractTool');
      setTools(contractTools);
      //console.log('contractTools', contractTools);
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  }, [account]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const fetchWidgetTools = useCallback(async () => {
    setIsLoading(true);
    try {
      const userId = accountAddress
      const response = await fetch(`/api/tools?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }
      const data = await response.json();
      const filteredTools = data.filter((tool: any) => tool.type === 'widgetTool');
      //console.log('filteredTools', filteredTools);
      setWidgets(filteredTools);
    } catch (error) {
      console.error('Error fetching widget tools:', error);
    } finally {
      setIsLoading(false);
    }
  }, [account?.address.toString()]);

  useEffect(() => {
    fetchWidgetTools();
  }, [fetchWidgetTools]);

  const widgetForm = useForm({
    defaultValues: {
      name: '',
      description: ''
    }
  });

  const onchangeWidgetPrompt = (e: any) => {
    setWidgetPrompt(e.target.value);
  };

  const onchangeWidgetCode = (e: any) => {
    setWidgetCode(e.target.value);
  };

  // Add this new function to reset the form and related state
  const resetForm = useCallback(() => {
    widgetForm.reset();
    setWidgetPrompt('');
    setWidgetCode('');
    setSelectedWidgetTools([]);
    setPreviewWidgetCode('');
  }, [widgetForm]);

  const handleSaveWidget = async () => {
    try {
      const widgetData = {
        type: 'widgetTool',
        name: widgetForm.getValues('name'),
        tool: {
          name: widgetForm.getValues('name'),
          description: widgetForm.getValues('description'),
          prompt: widgetPrompt,
          code: widgetCode,
          tool_ids: selectedWidgetTools
        },
        user_id: accountAddress
      };
      console.log('widgetData', widgetData);
      const response = await axios.post('/api/tools', widgetData);
      console.log('Widget saved successfully:', response.data);

      // Use the new resetForm function
      resetForm();
      fetchWidgetTools();
      setIsOpenCreateWidget(false);

      // Show success message
      toast({
        title: 'Widget created successfully!',
        description: 'Your widget has been created and saved.'
      });
    } catch (error) {
      console.error('Error saving widget:', error);
      toast({
        title: 'Error creating widget',
        description: 'Please try again.'
      });
    }
  };

  const handlePreviewWidget = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      toast({
        title: 'Previewing widget...',
        description: 'Please wait while we generate the preview.'
      });
      const data = {
        prompt: widgetPrompt,
        tool_ids: selectedWidgetTools
      };

      const response = await axios.post('/api/create-widget', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const code = response.data.code;
      setPreviewWidgetCode(code);
      setWidgetCode(code);
      toast({
        title: 'Widget previewed successfully!',
        description: 'Your widget has been previewed successfully.'
      });
      console.log('Previewing widget', response.data);
    } catch (error) {
      console.error('Error previewing widget:', error);
      toast({
        title: 'Error previewing widget',
        description: 'Please try again.'
      });
    }
  };

  return (
    <div className={classNames('flex w-full grow py-4', className)}>
      <div className="container flex flex-col items-center gap-6">
        <h1 className="mt-5 text-h5 font-bold">Widgets</h1>
        <div className="flex w-full justify-end">
          <Button onClick={() => setIsOpenCreateWidget(true)}>Create widget</Button>
        </div>
        {isLoading ? (
          <div className="text-center">Loading widgets...</div>
        ) : widgets.length > 0 ? (
          <div className="grid w-full grid-cols-3 gap-4">
            {widgets.map((widget: any) => (
              <div
                key={widget._id}
                className="flex flex-col items-start justify-between gap-2 rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <h2 className="text-lg font-semibold">{widget.name}</h2>
                <span className="rounded text-xs text-gray-500">{widget.tool.type || 'Widget'}</span>
                <p className="text-sm text-white">{widget.tool.description.slice(0, 30) + '...'}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">No widgets found. Create your first widget!</div>
        )}
        <AugmentedPopup
          visible={isOpenCreateWidget}
          onClose={() => {
            setIsOpenCreateWidget(false);
            resetForm(); // Add this line to reset the form when closing the modal
          }}
          textHeading={'Create Widget'}
        >
          <form className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto p-8">
            <FormTextField form={widgetForm} name="name" label="Name" />
            <FormTextField form={widgetForm} name="description" label="Description" />
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Select Tools</label>
              <MultiSelectTools
                tools={tools || []}
                selectedTools={selectedWidgetTools}
                onChangeSelectedTools={setSelectedWidgetTools}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Prompt</label>
              <Textarea value={widgetPrompt} onChange={onchangeWidgetPrompt} className="min-h-[100px]" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Code</label>
              <Textarea value={widgetCode} onChange={onchangeWidgetCode} className="font-mono min-h-[150px]" />
            </div>
            {previewWidgetCode && (
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-white">Preview</label>
                <ViewFrame code={previewWidgetCode} />
              </div>
            )}
            <div className="flex justify-end gap-4">
              <Button onClick={handlePreviewWidget} type="button">
                Preview
              </Button>
              <Button onClick={handleSaveWidget} type="button">
                Save
              </Button>
            </div>
          </form>
        </AugmentedPopup>
      </div>
    </div>
  );
};

export default WidgetRoot;
