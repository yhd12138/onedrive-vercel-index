import type { OdFolderChildren } from '../types'

import Link from 'next/link'
import { FC } from 'react'
import { useClipboard } from 'use-clipboard-copy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'next-i18next'

import { getBaseUrl } from '../utils/getBaseUrl'
import { humanFileSize, formatModifiedDateTime } from '../utils/fileDetails'

import { Downloading, Checkbox, ChildIcon, ChildName } from './FileListing'
import { getStoredToken } from '../utils/protectedRouteHandler'


let host_direct:string='onedrive.yhdog.xyz';
let host_proxy:string='repo.yhdog.xyz';
let host_proxy6:string='repo6.yhdog.xyz';

const FileListItem: FC<{ fileContent: OdFolderChildren }> = ({ fileContent: c }) => {
  return (
    <div className="grid cursor-pointer grid-cols-10 items-center space-x-2 px-3 py-2.5">
      <div className="col-span-10 flex items-center space-x-2 truncate md:col-span-6" title={c.name}>
        <div className="w-5 flex-shrink-0 text-center">
          <ChildIcon child={c} />
        </div>
        <ChildName name={c.name} folder={Boolean(c.folder)} />
      </div>
      <div className="col-span-3 hidden flex-shrink-0 font-mono text-sm text-gray-700 dark:text-gray-500 md:block">
        {formatModifiedDateTime(c.lastModifiedDateTime)}
      </div>
      <div className="col-span-1 hidden flex-shrink-0 truncate font-mono text-sm text-gray-700 dark:text-gray-500 md:block">
        {humanFileSize(c.size)}
      </div>
    </div>
  )
}

const FolderListLayout = ({
  path,
  folderChildren,
  selected,
  toggleItemSelected,
  totalSelected,
  toggleTotalSelected,
  totalGenerating,
  handleSelectedDownload,
  folderGenerating,
  handleSelectedPermalink,
  handleFolderDownload,
  toast,
}) => {
  const clipboard = useClipboard()
  const hashedToken = getStoredToken(path)

  const { t } = useTranslation()

  // Get item path from item name
  const getItemPath = (name: string) => `${path === '/' ? '' : path}/${encodeURIComponent(name)}`

  return (
    <div className="rounded bg-white shadow-sm dark:bg-gray-900 dark:text-gray-100">
      <div className="grid grid-cols-12 items-center space-x-2 border-b border-gray-900/10 dark:border-gray-500/30">
        <div className="col-span-12 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300 md:col-span-6">
          {t('Name')}
        </div>
        <div className="col-span-3 px-2 hidden text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300 md:block">
          {t('Last Modified')}
        </div>
        <div className="hidden text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300 md:block">
          {t('Size')}
        </div>
        <div className="hidden px-3 text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300 md:block">
          {t('Actions')}
        </div>
        <div className="hidden text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300 md:block">
          <div className="hidden p-1.5 text-gray-700 dark:text-gray-400 md:flex">
            <Checkbox
              checked={totalSelected}
              onChange={toggleTotalSelected}
              indeterminate={true}
              title={t('Select files')}
            />
            <button
              title={t('Copy selected files permalink')}
              className="cursor-pointer rounded p-1.5 hover:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-white dark:hover:bg-gray-600 disabled:dark:text-gray-600 disabled:hover:dark:bg-gray-900"
              disabled={totalSelected === 0}
              onClick={() => {
                clipboard.copy(handleSelectedPermalink(getBaseUrl()))
                toast.success(t('Copied selected files permalink.'))
              }}
            >
              <FontAwesomeIcon icon={['far', 'copy']} size="lg" />
            </button>
            {/* To hide the Download Button of selected Items. 
            {totalGenerating ? (
              <Downloading title={t('Downloading selected files, refresh page to cancel')} style="p-1.5" />
            ) : (
              <button
                title={t('Download selected files')}
                className="cursor-pointer rounded p-1.5 hover:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-white dark:hover:bg-gray-600 disabled:dark:text-gray-600 disabled:hover:dark:bg-gray-900"
                disabled={totalSelected === 0}
                onClick={handleSelectedDownload}
              >
                <FontAwesomeIcon icon={['far', 'arrow-alt-circle-down']} size="lg" />
              </button>
            )}
            To hide the Download Button of selected Items. */}
          </div>
        </div>
      </div>

      {folderChildren.map((c: OdFolderChildren) => (
        <div
          className="grid grid-cols-12 transition-all duration-100 hover:bg-gray-100 dark:hover:bg-gray-850"
          key={c.id}
        >
          <Link
            href={`${path === '/' ? '' : path}/${encodeURIComponent(c.name)}`}
            passHref
            className="col-span-12 md:col-span-10"
          >
            <FileListItem fileContent={c} />
          </Link>

          {c.folder ? (
            <div className="hidden py-1.5 text-gray-700 dark:text-gray-400 md:flex">
              <span
                title={t('Copy folder permalink')}
                className="cursor-pointer rounded px-1.5 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => {
                  {/* To replace the permalink of a folder. 
                  clipboard.copy(`${getBaseUrl()}${`${path === '/' ? '' : path}/${encodeURIComponent(c.name)}`}`)
                  To replace the permalink of a folder. */}
                  clipboard.copy(`https://${host_direct}${`${path === '/' ? '' : path}/${encodeURIComponent(c.name)}`}`)
                  toast(t('Copied folder permalink.'), { icon: '👌' })
                }}
              >
                <FontAwesomeIcon icon={['far', 'copy']} />
              </span>
              {/* To hide the Download Button of any Folders. 
              {folderGenerating[c.id] ? (
                <Downloading title={t('Downloading folder, refresh page to cancel')} style="px-1.5 py-1" />
              ) : (
                <span
                  title={t('Download folder')}
                  className="cursor-pointer rounded px-1.5 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
                  onClick={() => {
                    const p = `${path === '/' ? '' : path}/${encodeURIComponent(c.name)}`
                    handleFolderDownload(p, c.id, c.name)()
                  }}
                >
                  <FontAwesomeIcon icon={['far', 'arrow-alt-circle-down']} />
                </span>
              )}
              To hide the Download Button of any Folders. */}
            </div>
          ) : (
            <div className="hidden py-1.5 text-gray-700 dark:text-gray-400 md:flex">
              {/* To hide the Copy Button of any Items. 
              <span
                title={t('Copy raw file permalink')}
                className="cursor-pointer rounded px-1.5 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => {
                  clipboard.copy(
                    // To replace the permalink of a file. 
                    `${getBaseUrl()}/api/raw/?path=${getItemPath(c.name)}${hashedToken ? `&odpt=${hashedToken}` : ''}`
                    // To replace the permalink of a file. 
                    `https://${host_direct}/api/raw/?path=${getItemPath(c.name)}${hashedToken ? `&odpt=${hashedToken}` : ''}`
                  )
                  toast.success(t('Copied raw file permalink.'))
                }}
              >
                <FontAwesomeIcon icon={['far', 'copy']} />
              </span>
              To hide the Copy Button of any Items. */}
              <a
                title={t('OneDrive Direct Download')}
                className="cursor-pointer rounded px-1.5 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
                href={`https://${host_direct}/api/raw/?path=${getItemPath(c.name)}${hashedToken ? `&odpt=${hashedToken}` : ''}`}
              >
                <FontAwesomeIcon icon={['far', 'arrow-alt-circle-down']} />
              </a>
              <a
                title={t('Proxy Download (IPv4)')}
                className="cursor-pointer rounded px-1.5 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
                href={`https://${host_proxy}/api/raw/?path=${getItemPath(c.name)}${hashedToken ? `&odpt=${hashedToken}` : ''}`}
              >
                <FontAwesomeIcon icon={['far', 'arrow-alt-circle-down']} />
              </a>
              <a
                title={t('Proxy Download (IPv6)')}
                className="cursor-pointer rounded px-1.5 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
                href={`https://${host_proxy6}/api/raw/?path=${getItemPath(c.name)}${hashedToken ? `&odpt=${hashedToken}` : ''}`}
              >
                <FontAwesomeIcon icon={['far', 'arrow-alt-circle-down']} />
              </a>
            </div>
          )}
          <div className="hidden px-5 py-1.5 text-gray-700 dark:text-gray-400 md:flex">
            {!c.folder && !(c.name === '.password') && (
              <Checkbox
                checked={selected[c.id] ? 2 : 0}
                onChange={() => toggleItemSelected(c.id)}
                title={t('Select file')}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default FolderListLayout
