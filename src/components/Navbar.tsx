import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconName } from '@fortawesome/fontawesome-svg-core'
import { Dialog, Transition } from '@headlessui/react'
import toast, { Toaster } from 'react-hot-toast'
import { useHotkeys } from 'react-hotkeys-hook'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useMemo, useState } from 'react'

import siteConfig from '../../config/site.config'
import SearchModal from './SearchModal'
import useDeviceOS from '../utils/useDeviceOS'

const Navbar = () => {
  const router = useRouter()
  const os = useDeviceOS()

  const [tokenPresent, setTokenPresent] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const [searchOpen, setSearchOpen] = useState(false)
  const openSearchBox = () => setSearchOpen(true)

  useHotkeys(`${os === 'mac' ? 'meta' : 'ctrl'}+k`, e => {
    openSearchBox()
    e.preventDefault()
  })

  useEffect(() => {
    const storedToken = () => {
      for (const r of siteConfig.protectedRoutes) {
        if (localStorage.hasOwnProperty(r)) {
          return true
        }
      }
      return false
    }
    setTokenPresent(storedToken())
  }, [])

  const clearTokens = () => {
    setIsOpen(false)

    siteConfig.protectedRoutes.forEach(r => {
      localStorage.removeItem(r)
    })

    toast.success('Cleared all tokens')
    setTimeout(() => {
      router.reload()
    }, 1000)
  }

  // ✅ 只做“展示顺序”处理：GitHub 单独提到固定位置，其余 link 按原顺序
  const { githubLink, otherLinks } = useMemo(() => {
    const links = Array.isArray(siteConfig.links) ? siteConfig.links : []
    const gh = links.find(l => (l?.name || '').toLowerCase() === 'github') || null
    const others = links.filter(l => (l?.name || '').toLowerCase() !== 'github')
    return { githubLink: gh, otherLinks: others }
  }, [])

  return (
    <div className="sticky top-0 z-[100] border-b border-gray-900/10 bg-white bg-opacity-80 backdrop-blur-md dark:border-gray-500/30 dark:bg-gray-900">
      <Toaster />

      <SearchModal searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

      <div className="mx-auto flex w-full items-center justify-between space-x-4 px-4 py-1">
        {/* ① 主页（OneDrive 主页） */}
        <Link href="/" passHref className="flex items-center space-x-2 py-2 hover:opacity-80 dark:text-white md:p-2">
          <Image src={siteConfig.icon} alt="icon" width="25" height="25" priority />
          <span className="hidden font-bold sm:block">{siteConfig.title}</span>
        </Link>

        {/* 右侧导航区域 */}
        <div className="flex flex-1 items-center space-x-4 text-gray-700 md:flex-initial">
          {/* ② 我的博客站点 */}
          <a
            href="https://qinghub.top"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:opacity-80 dark:text-white"
          >
            <FontAwesomeIcon icon="book" />
            <span className="hidden text-sm font-medium md:inline-block">{'Blog'}</span>
          </a>

          {/* ③ 关于页面 */}
          <a
            href="https://qinghub.top/about/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:opacity-80 dark:text-white"
          >
            <FontAwesomeIcon icon="external-link-alt" />
            <span className="hidden text-sm font-medium md:inline-block">{'About'}</span>
          </a>

          {/* ④ GitHub（从 siteConfig.links 里单独提出来放这里） */}
          {githubLink && (
            <a
              key={githubLink.name}
              href={githubLink.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:opacity-80 dark:text-white"
            >
              <FontAwesomeIcon icon={['fab', githubLink.name.toLowerCase() as IconName]} />
              <span className="hidden text-sm font-medium md:inline-block">{githubLink.name}</span>
            </a>
          )}

          {/* ⑤ Email */}
          {siteConfig.email && (
            <a href={siteConfig.email} className="flex items-center space-x-2 hover:opacity-80 dark:text-white">
              <FontAwesomeIcon icon={['far', 'envelope']} />
              <span className="hidden text-sm font-medium md:inline-block">{'Email'}</span>
            </a>
          )}

          {/* Logout（仅当 tokenPresent 才会出现，不影响你的目标顺序）
              你如果希望它也在搜索框之前/之后，我可以再按你的习惯微调 */}
          {tokenPresent && (
            <button
              className="flex items-center space-x-2 hover:opacity-80 dark:text-white"
              onClick={() => setIsOpen(true)}
            >
              <span className="hidden text-sm font-medium md:inline-block">{'Logout'}</span>
              <FontAwesomeIcon icon="sign-out-alt" />
            </button>
          )}

          {/* ⑦ 搜索框（放到最右侧） */}
          <button
            className="flex flex-1 items-center justify-between rounded-lg bg-gray-100 px-2.5 py-1.5 hover:opacity-80 dark:bg-gray-800 dark:text-white md:w-48"
            onClick={openSearchBox}
          >
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon className="h-4 w-4" icon="search" />
              <span className="truncate text-sm font-medium">{'Search ...'}</span>
            </div>

            <div className="hidden items-center space-x-1 md:flex">
              <div className="rounded-lg bg-gray-200 px-2 py-1 text-xs font-medium dark:bg-gray-700">
                {os === 'mac' ? '⌘' : 'Ctrl'}
              </div>
              <div className="rounded-lg bg-gray-200 px-2 py-1 text-xs font-medium dark:bg-gray-700">K</div>
            </div>
          </button>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" open={isOpen} onClose={() => setIsOpen(false)}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-50"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-50 dark:bg-gray-800" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-50"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle transition-all dark:bg-gray-900">
                <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {'Clear all tokens?'}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {'These tokens are used to authenticate yourself into password protected folders, ' +
                      'clearing them means that you will need to re-enter the passwords again.'}
                  </p>
                </div>

                <div className="mt-4 max-h-32 overflow-y-scroll font-mono text-sm dark:text-gray-100">
                  {siteConfig.protectedRoutes.map((r, i) => (
                    <div key={i} className="flex items-center space-x-1">
                      <FontAwesomeIcon icon="key" />
                      <span className="truncate">{r}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-end">
                  <button
                    className="mr-3 inline-flex items-center justify-center space-x-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {'Cancel'}
                  </button>
                  <button
                    className="inline-flex items-center justify-center space-x-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-400 focus:outline-none focus:ring focus:ring-red-300"
                    onClick={() => clearTokens()}
                  >
                    <FontAwesomeIcon icon={['far', 'trash-alt']} />
                    <span>{'Clear all'}</span>
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default Navbar