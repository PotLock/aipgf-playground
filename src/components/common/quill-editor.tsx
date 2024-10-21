// 'use client';

// import React, { FC, RefObject, useEffect, useRef } from 'react';
// import classNames from 'classnames';
// import Quill, { QuillOptions, Range } from 'quill';

// import { ComponentBaseProps } from '@/common/interfaces';

// import 'quill/dist/quill.snow.css';

// type QuillEditorProps = {
//   value?: string;
//   editorRef?: RefObject<HTMLDivElement>;
//   quillRef?: React.MutableRefObject<Quill | null>;
//   onSelectionChanged?: (value: Range) => void;
//   onChange?: (value: string) => void;
//   onImageClick?: (value: string) => void;
// } & ComponentBaseProps;

// const QuillEditor: FC<QuillEditorProps> = ({
//   className,
//   value = '',
//   editorRef,
//   quillRef,
//   onChange,
//   onImageClick,
//   onSelectionChanged
// }) => {
//   const defaultErditorRef = useRef<HTMLDivElement | null>(null);
//   const internalQuillRef = useRef<Quill>();
//   const refToUse = editorRef || defaultErditorRef;

//   useEffect(() => {
//     if (refToUse.current && !internalQuillRef.current) {
//       const options: QuillOptions = {
//         theme: 'snow',
//         modules: {
//           toolbar: [
//             [
//               { header: [1, 2, 3, 4, false] },
//               { font: [] },
//               'bold',
//               'italic',
//               'underline',
//               'strike',
//               'blockquote',
//               { list: 'ordered' },
//               { list: 'bullet' },
//               { color: [] },
//               { background: [] },
//               { align: [] },
//               'link',
//               'image',
//               'video',
//               'clean'
//             ]
//           ]
//         }
//       };

//       const quill = new Quill(refToUse.current, options);

//       const toolbar = quill.getModule('toolbar') as any;

//       toolbar.addHandler('image', onImageClick);

//       internalQuillRef.current = quill;

//       quill.on('text-change', () => onChange?.(quill.root.innerHTML));
//       quill.on('selection-change', range => range && onSelectionChanged?.(range));

//       if (quillRef) {
//         quillRef.current = quill;
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (internalQuillRef.current) {
//       internalQuillRef.current.root.innerHTML = value;
//     }
//   }, [value]);

//   return (
//     <div>
//       <div ref={refToUse} className={classNames(className)} />
//     </div>
//   );
// };

// export default QuillEditor;
