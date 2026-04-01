import { usePageSizeStore } from '@/shared/model/page-size-store'

/** Reseta itens por página da tabela; evita vazamento de localStorage e falhas nos testes de ordenação. */
beforeEach(() => {
  usePageSizeStore.persist.clearStorage()
  usePageSizeStore.setState({ pageSize: 20 })
})
