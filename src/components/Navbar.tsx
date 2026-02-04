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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [searchOpen, setSearchOpen] = useState(false)
  const openSearchBox = () => setSearchOpen(true)
  const openSearchFromMenu = () => {
    setMobileMenuOpen(false)
    setSearchOpen(true)
  }

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
  const { githubLink } = useMemo(() => {
    const links = Array.isArray(siteConfig.links) ? siteConfig.links : []
    const gh = links.find(l => (l?.name || '').toLowerCase() === 'github') || null
    return { githubLink: gh }
  }, [])

  return (
    <div className="sticky top-0 z-[100] border-b border-gray-900/10 bg-white bg-opacity-80 backdrop-blur-md dark:border-gray-500/30 dark:bg-gray-900">
      <Toaster />

      <SearchModal searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

      <div className="mx-auto flex w-full items-center justify-between space-x-3 px-4 py-0">
        {/* ① 主页（OneDrive 主页） */}
        <Link href="/" passHref className="flex items-center space-x-2 py-1 hover:opacity-80 dark:text-white">
          <Image
            src={siteConfig.icon}
            alt="icon"
            width={40}
            height={40}
            priority
            className="h-10 w-10 md:h-11 md:w-11"
          />
          <span className="block max-w-[55vw] truncate text-base font-bold leading-tight text-blue-600 dark:text-blue-400 sm:max-w-none sm:text-lg md:text-xl">
            {siteConfig.title}
          </span>
        </Link>

        {/* 右侧导航区域：桌面端直出，小屏折叠到抽屉 */}
        <div className="flex items-center">
          {/* Mobile hamburger */}
          <button
            className="inline-flex items-center justify-center rounded-lg p-1.5 text-gray-700 hover:bg-gray-100 hover:opacity-90 dark:text-gray-100 dark:hover:bg-gray-800 md:hidden"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <FontAwesomeIcon icon="bars" />
          </button>

          {/* Desktop nav */}
          <div className="hidden items-center space-x-4 text-gray-700 md:flex">
            {/* ② 我的博客站点 */}
            <a
              href="https://qinghub.top"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:opacity-80 dark:text-white"
            >
              <FontAwesomeIcon icon="book" />
              <span className="hidden text-sm font-medium lg:inline-block">{'我的博客'}</span>
            </a>

            {/* ③ 关于页面 */}
            <a
              href="https://qinghub.top/about/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:opacity-80 dark:text-white"
            >
              <FontAwesomeIcon icon="external-link-alt" />
              <span className="hidden text-sm font-medium lg:inline-block">{'关于页面'}</span>
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
                <span className="hidden text-sm font-medium lg:inline-block">{githubLink.name}</span>
              </a>
            )}

            {/* ⑤ Email */}
            {siteConfig.email && (
              <a href={siteConfig.email} className="flex items-center space-x-2 hover:opacity-80 dark:text-white">
                <FontAwesomeIcon icon={['far', 'envelope']} />
                <span className="hidden text-sm font-medium lg:inline-block">{'Email'}</span>
              </a>
            )}

            {/* Logout（仅当 tokenPresent 才会出现） */}
            {tokenPresent && (
              <button
                className="flex items-center space-x-2 hover:opacity-80 dark:text-white"
                onClick={() => setIsOpen(true)}
              >
                <span className="hidden text-sm font-medium lg:inline-block">{'Logout'}</span>
                <FontAwesomeIcon icon="sign-out-alt" />
              </button>
            )}

            {/* ⑦ 搜索框（桌面端） */}
            <button
              className="flex items-center justify-between rounded-lg bg-gray-100 px-2.5 py-1.5 hover:opacity-80 dark:bg-gray-800 dark:text-white md:w-48"
              onClick={openSearchBox}
            >
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon className="h-4 w-4" icon="search" />
                <span className="truncate text-sm font-medium">{'Search ...'}</span>
              </div>

              <div className="hidden items-center space-x-1 lg:flex">
                <div className="rounded-lg bg-gray-200 px-2 py-1 text-xs font-medium dark:bg-gray-700">
                  {os === 'mac' ? '⌘' : 'Ctrl'}
                </div>
                <div className="rounded-lg bg-gray-200 px-2 py-1 text-xs font-medium dark:bg-gray-700">K</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <Transition appear show={mobileMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-[150] overflow-hidden md:hidden"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-150"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-150"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="ease-in duration-100"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-900/10 px-4 py-3 dark:border-gray-500/30">
                  <Dialog.Title className="text-sm font-semibold text-gray-900 dark:text-gray-100">{'导航'}</Dialog.Title>
                  <button
                    className="inline-flex items-center justify-center rounded-lg p-1.5 text-gray-700 hover:bg-gray-100 hover:opacity-90 dark:text-gray-100 dark:hover:bg-gray-800"
                    aria-label="Close menu"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon="xmark" />
                  </button>
                </div>

                <div className="space-y-1 p-3 text-gray-900 dark:text-gray-100">
                  <button
                    className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={openSearchFromMenu}
                  >
                    <FontAwesomeIcon icon="search" />
                    <span className="text-sm font-medium">{'Search'}</span>
                  </button>

                  <a
                    href="https://qinghub.top"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon="book" />
                    <span className="text-sm font-medium">{'我的博客'}</span>
                  </a>

                  <a
                    href="https://qinghub.top/about/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon="external-link-alt" />
                    <span className="text-sm font-medium">{'关于页面'}</span>
                  </a>

                  {githubLink && (
                    <a
                      key={githubLink.name}
                      href={githubLink.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={['fab', githubLink.name.toLowerCase() as IconName]} />
                      <span className="text-sm font-medium">{githubLink.name}</span>
                    </a>
                  )}

                  {siteConfig.email && (
                    <a
                      href={siteConfig.email}
                      className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={['far', 'envelope']} />
                      <span className="text-sm font-medium">{'Email'}</span>
                    </a>
                  )}

                  {tokenPresent && (
                    <button
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setIsOpen(true)
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <FontAwesomeIcon icon="sign-out-alt" />
                        <span className="text-sm font-medium">{'Logout'}</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-[160] overflow-y-auto"
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
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
